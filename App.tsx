
import React, { useState, useEffect, useCallback } from 'react';
import { Section, SectionType, ProjectInfo, AppStatus } from './types';
import { gemini } from './services/gemini';
import SectionRenderer from './components/SectionRenderer';
import PropertyPanel from './components/PropertyPanel';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.SETUP);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    productName: '',
    productDesc: '',
    targetAudience: '일반 고객',
    tone: '전문적이고 신뢰감 있는'
  });
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);

  const startProject = () => {
    if (!projectInfo.productName || !projectInfo.productDesc) {
      alert("상품명과 상품 설명을 입력해주세요!");
      return;
    }
    setStatus(AppStatus.EDITING);
  };

  const addSection = async (type: SectionType) => {
    setIsAddingSection(true);
    try {
      const { title, content } = await gemini.generateCopy(projectInfo, type);
      const newSection: Section = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title,
        content,
        backgroundColor: '#ffffff',
        textColor: '#111827',
        imageUrl: type === 'Hero' ? 'https://picsum.photos/800/600' : undefined
      };
      setSections([...sections, newSection]);
      setSelectedId(newSection.id);
    } catch (e) {
      console.error(e);
      alert("AI 섹션 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsAddingSection(false);
    }
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSection = (id: string) => {
    if (confirm("이 섹션을 삭제하시겠습니까?")) {
      setSections(prev => prev.filter(s => s.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  const selectedSection = sections.find(s => s.id === selectedId);

  const sectionLabelMap: Record<SectionType, string> = {
    'Hero': '메인 인트로',
    'Features': '주요 특장점',
    'Review': '베스트 리뷰',
    'Spec': '상세 스펙',
    'CTA': '구매 유도',
    'Event': '이벤트/혜택'
  };

  if (status === AppStatus.SETUP) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Detail Maker AI</h1>
            <p className="text-gray-500">AI로 10분 만에 완성하는 고퀄리티 상세페이지</p>
          </header>

          <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">상품명</label>
                <input 
                  type="text" 
                  placeholder="예: 인체공학적 모션 데스크"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={projectInfo.productName}
                  onChange={e => setProjectInfo({...projectInfo, productName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">상품 설명 및 특징</label>
                <textarea 
                  rows={4}
                  placeholder="상품의 핵심 특징, 소재, 혜택 등을 자유롭게 적어주세요..."
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={projectInfo.productDesc}
                  onChange={e => setProjectInfo({...projectInfo, productDesc: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">타겟 고객</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    value={projectInfo.targetAudience}
                    onChange={e => setProjectInfo({...projectInfo, targetAudience: e.target.value})}
                  >
                    <option>일반 고객</option>
                    <option>2030 직장인</option>
                    <option>4050 주부</option>
                    <option>1인 가구/자취생</option>
                    <option>운동/헬스 매니아</option>
                    <option>반려동물 집사</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">문구 말투</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    value={projectInfo.tone}
                    onChange={e => setProjectInfo({...projectInfo, tone: e.target.value})}
                  >
                    <option>전문적이고 신뢰감 있는</option>
                    <option>친절하고 다정한</option>
                    <option>감성적인</option>
                    <option>강력하게 강조하는</option>
                    <option>위트 있고 유머러스한</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={startProject}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1"
            >
              상세페이지 제작 시작
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Top Navbar */}
      <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shrink-0 no-print">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">DM</span>
          </div>
          <h2 className="font-bold text-gray-800">{projectInfo.productName || '새 프로젝트'}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setStatus(AppStatus.SETUP)}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            설정 변경
          </button>
          <button 
            className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-100"
            onClick={() => window.print()}
          >
            PDF/이미지 저장
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Templates */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 no-print">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">섹션 추가</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(Object.keys(sectionLabelMap) as SectionType[]).map(type => (
              <button 
                key={type}
                disabled={isAddingSection}
                onClick={() => addSection(type)}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-50 hover:border-blue-100 hover:bg-blue-50 group transition-all"
              >
                <span className="font-bold text-gray-700 group-hover:text-blue-700">{sectionLabelMap[type]}</span>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </button>
            ))}
            {isAddingSection && (
              <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-gray-400">AI가 작성 중...</span>
              </div>
            )}
          </div>
          <div className="p-4 text-center">
             <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest">Powered by Gemini 3</p>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 bg-gray-100 p-8 overflow-y-auto print:bg-white print:p-0">
          <div className="max-w-4xl mx-auto min-h-full">
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white border-2 border-dashed border-gray-200 rounded-3xl text-center px-12 no-print">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">상세페이지를 구성해보세요</h3>
                <p className="text-gray-500 mb-8">왼쪽 사이드바에서 원하는 섹션을 클릭하면 AI가 상품 정보를 분석하여 맞춤형 문구와 레이아웃을 생성합니다.</p>
                <div className="flex flex-wrap justify-center gap-2">
                   <button onClick={() => addSection('Hero')} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">메인부터 시작</button>
                   <button onClick={() => addSection('Features')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">장점 추가하기</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 print:space-y-0">
                {sections.map(section => (
                  <SectionRenderer 
                    key={section.id} 
                    section={section} 
                    isSelected={selectedId === section.id}
                    onClick={() => setSelectedId(section.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Panel: Properties */}
        {selectedSection ? (
          <PropertyPanel 
            section={selectedSection}
            projectInfo={projectInfo}
            onUpdate={(updates) => updateSection(selectedSection.id, updates)}
            onDelete={() => deleteSection(selectedSection.id)}
          />
        ) : (
          <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col items-center justify-center p-8 text-center shrink-0 no-print">
             <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
             </div>
             <p className="text-sm font-bold text-gray-400">편집할 섹션을 캔버스에서 선택해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
