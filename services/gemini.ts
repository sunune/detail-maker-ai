
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ProjectInfo, SectionType } from "../types";

const API_KEY = process.env.API_KEY || "";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async generateCopy(info: ProjectInfo, sectionType: SectionType): Promise<{ title: string; content: string }> {
    const prompt = `
      한국 이커머스 시장(스마트스토어, 쿠팡 등)에 최적화된 상품 상세페이지 문구를 작성해주세요.
      상품명: ${info.productName}
      상품 설명: ${info.productDesc}
      타겟 고객: ${info.targetAudience}
      말투(톤앤매너): ${info.tone}
      섹션 유형: ${sectionType}

      가이드라인:
      - Hero (메인 인트로): 고객의 시선을 사로잡는 강력한 헤드라인과 짧은 서브 문구.
      - Features (특장점): 상품의 핵심 장점 3가지를 명확한 제목과 설명으로 작성.
      - Review (리뷰): 실제로 사용해본 것 같은 생생한 고객 후기 1개.
      - Spec (상세 정보): 기술적 사양이나 상품 정보를 깔끔한 리스트 형식으로 작성.
      - CTA (구매 유도): 지금 바로 구매해야 할 이유와 강력한 구매 유도 문구.
      - Event (이벤트): 할인, 1+1, 리뷰 이벤트 등 혜택 강조 문구.

      반드시 한국어로 작성하고, 결과는 "title"과 "content" 필드를 가진 JSON 객체로 반환하세요.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING }
            },
            required: ["title", "content"]
          }
        }
      });

      const data = JSON.parse(response.text);
      return data;
    } catch (error) {
      console.error("Error generating copy:", error);
      return { title: "문구 생성 오류", content: "문구를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요." };
    }
  }

  async compositeImage(productBase64: string, backgroundBase64?: string): Promise<string> {
    const prompt = backgroundBase64 
      ? "첫 번째 이미지의 상품을 두 번째 이미지의 배경과 자연스럽게 합성해주세요. 그림자와 조명을 조절하여 실제 촬영한 것처럼 전문적으로 만들어주세요."
      : "이 상품 이미지에서 배경을 제거(누끼 따기)하고, 아주 깨끗하고 전문적인 스튜디오 화이트 배경에 자연스러운 그림자가 포함된 이미지로 만들어주세요.";

    const parts: any[] = [{ inlineData: { data: productBase64, mimeType: "image/png" } }];
    if (backgroundBase64) {
      parts.push({ inlineData: { data: backgroundBase64, mimeType: "image/png" } });
    }
    parts.push({ text: prompt });

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data returned from Gemini");
    } catch (error) {
      console.error("Error compositing image:", error);
      throw error;
    }
  }
}

export const gemini = new GeminiService();
