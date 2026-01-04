
import React, { useState } from 'react';
import { Section, ProjectInfo } from '../types';
import { gemini } from '../services/gemini';

interface PropertyPanelProps {
  section: Section;
  projectInfo: ProjectInfo;
  onUpdate: (updates: Partial<Section>) => void;
  onDelete: () => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ section, projectInfo, onUpdate, onDelete }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isCompositing, setIsCompositing] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const { title, content } = await gemini.generateCopy(projectInfo, section.type);
      onUpdate({ title, content });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiComposite = async () => {
    if (!section.imageUrl) {
      alert("먼저 상품 이미지를 업로드해주세요!");
      return;
    }
    setIsCompositing(true);
    try {
      const base64 = section.imageUrl.split(',')[1];
      const result = await gemini.compositeImage(base64);
      onUpdate({ imageUrl: result });
    } catch (e) {
      alert("AI 이미지 처리에 실패했습니다. API 키를 확인해주세요.");
    } finally {
      setIsCompositing(false);
    }
  };

  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 overflow-y-auto p-6 no-print shrink-0">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800">섹션 편집</h3>
        <button onClick={onDelete} className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">제목</label>
          <input 
            type="text" 
            value={section.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">내용</label>
          <textarea 
            rows={5}
            value={section.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
          />
        </div>

        <button 
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isRegenerating ? (
             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          )}
          AI로 문구 다시 쓰기
        </button>

        <hr className="border-gray-100" />

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">이미지 설정</label>
          <div className="flex flex-col gap-3">
            <div className="relative border-2 border-dashed border-gray-100 rounded-xl p-4 text-center group hover:border-blue-100 transition-colors">
               {section.imageUrl ? (
                 <img src={section.imageUrl} className="w-full h-32 object-contain mb-2 rounded-lg" />
               ) : (
                 <div className="w-full h-32 flex flex-col items-center justify-center text-gray-300">
                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-xs">상품 사진 없음</span>
                 </div>
               )}
               <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="text-[10px] font-bold text-blue-500">사진 변경하기</span>
            </div>
            
            {section.imageUrl && (
              <button 
                onClick={handleAiComposite}
                disabled={isCompositing}
                className="w-full py-2.5 px-4 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isCompositing ? (
                   <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                )}
                AI 배경 제거/합성
              </button>
            )}
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">배경색</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={section.backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="w-full h-10 border-0 cursor-pointer rounded-lg overflow-hidden p-0"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">글자색</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={section.textColor}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="w-full h-10 border-0 cursor-pointer rounded-lg overflow-hidden p-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
