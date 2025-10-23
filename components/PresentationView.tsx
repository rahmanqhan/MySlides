import React from 'react';
import { SlideContent, Template } from '../types';
import { ArrowLeftIcon, DownloadIcon, RefreshCwIcon } from './IconComponents';
import Slide from './Slide';

interface PresentationViewProps {
  slides: SlideContent[];
  template: Template;
  onReset: () => void;
  onBack: () => void;
  onExport: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ slides, template, onReset, onBack, onExport }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-primary">Your Presentation is Ready!</h2>
        <p className="text-brand-text-secondary mt-2 text-lg">Review your AI-generated slides below or export them.</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center w-full gap-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-brand-surface text-brand-text-primary font-semibold rounded-lg border border-brand-border hover:bg-brand-border transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Change Template
          </button>
          <button
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-brand-surface text-brand-text-primary font-semibold rounded-lg border border-brand-border hover:bg-brand-border transition-colors"
          >
            <RefreshCwIcon className="w-5 h-5 mr-2" />
            Start Over
          </button>
          <button
            onClick={onExport}
            className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-brand-accent text-white font-semibold rounded-lg hover:bg-brand-accent-light transition-colors"
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Export to .pptx
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        {slides.map((slide, index) => (
          <Slide key={index} slide={slide} index={index} totalSlides={slides.length} template={template} />
        ))}
      </div>
    </div>
  );
};

export default PresentationView;