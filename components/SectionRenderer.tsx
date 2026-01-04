
import React from 'react';
import { Section } from '../types';

interface SectionRendererProps {
  section: Section;
  isSelected: boolean;
  onClick: () => void;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, isSelected, onClick }) => {
  const containerStyle = `
    relative p-8 md:p-12 mb-4 border-2 transition-all cursor-pointer group
    ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-200'}
    rounded-lg shadow-sm
  `;

  const renderContent = () => {
    switch (section.type) {
      case 'Hero':
        return (
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight" style={{ color: section.textColor }}>
                {section.title}
              </h1>
              <p className="text-lg opacity-90" style={{ color: section.textColor }}>
                {section.content}
              </p>
            </div>
            {section.imageUrl && (
              <div className="flex-1 w-full max-w-sm overflow-hidden rounded-2xl shadow-xl">
                <img src={section.imageUrl} alt="Hero" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>
        );
      case 'Features':
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8" style={{ color: section.textColor }}>{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {section.content.split('\n').filter(l => l.trim()).map((feature, idx) => (
                <div key={idx} className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <p className="text-lg font-medium" style={{ color: section.textColor }}>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Spec':
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: section.textColor }}>{section.title}</h2>
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
               <pre className="p-6 whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed" style={{ color: section.textColor }}>
                {section.content}
              </pre>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ color: section.textColor }}>{section.title}</h2>
            <p style={{ color: section.textColor }}>{section.content}</p>
          </div>
        );
    }
  };

  return (
    <section 
      onClick={onClick}
      className={containerStyle} 
      style={{ backgroundColor: section.backgroundColor }}
    >
      {renderContent()}
      <div className={`absolute top-2 right-2 flex gap-2 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
          {section.type}
        </span>
      </div>
    </section>
  );
};

export default SectionRenderer;
