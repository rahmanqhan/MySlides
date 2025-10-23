import React, { useState } from 'react';
import { Template } from '../types';
import { ArrowLeftIcon, SparklesIcon } from './IconComponents';

interface TemplateSelectorProps {
  templates: Template[];
  onGenerate: (template: Template) => void;
  onBack: () => void;
}

const TemplateCard: React.FC<{ template: Template; isSelected: boolean; onSelect: () => void; }> = ({ template, isSelected, onSelect }) => {
  const { name, description, theme } = template;
  const ringClass = isSelected ? 'ring-4 ring-brand-accent' : 'ring-2 ring-brand-border';

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none ${ringClass}`}
      style={{
        backgroundColor: `#${theme.backgroundColor}`,
        color: `#${theme.textColor}`,
        border: `1px solid #${theme.accentColor}`
      }}
    >
      <h3 className="font-bold text-lg" style={{ color: `#${theme.accentColor}` }}>{name}</h3>
      <p className="text-sm opacity-90 mt-1">{description}</p>
      <div className="flex space-x-2 mt-3">
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `#${theme.backgroundColor}`, border: `1px solid #${theme.textColor}` }}></div>
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `#${theme.textColor}` }}></div>
        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `#${theme.accentColor}` }}></div>
      </div>
    </button>
  );
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onGenerate, onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);

  const handleGenerate = () => {
    if (selectedTemplate) {
      onGenerate(selectedTemplate);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-primary">Choose a Template</h2>
        <p className="text-brand-text-secondary mt-2 text-lg">Select a visual style for your presentation.</p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate.id === template.id}
            onSelect={() => setSelectedTemplate(template)}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center w-full space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-brand-surface text-brand-text-primary font-semibold rounded-lg border border-brand-border hover:bg-brand-border transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Outline
        </button>
        <button
          onClick={handleGenerate}
          disabled={!selectedTemplate}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-brand-accent text-white font-semibold rounded-lg shadow-md hover:bg-brand-accent-light disabled:bg-gray-500 transition-colors transform hover:scale-105"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          Generate Presentation
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;