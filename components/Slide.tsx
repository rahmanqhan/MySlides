import React from 'react';
import { SlideContent, Template } from '../types';
import { ImageIcon } from './IconComponents';

interface SlideProps {
  slide: SlideContent;
  index: number;
  totalSlides: number;
  template: Template;
}

const SlideLayoutRenderer: React.FC<{ slide: SlideContent }> = ({ slide }) => {
  const contentBody = (
    <ul className="space-y-3 list-disc list-inside text-brand-text-primary text-base md:text-lg lg:text-xl leading-relaxed">
      {slide.content.map((point, i) => (
        <li key={i}>{point}</li>
      ))}
    </ul>
  );

  const imagePlaceholder = (
      <div className="w-full h-full flex items-center justify-center flex-col text-brand-text-secondary bg-brand-bg">
          <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
          <span className="text-sm">Image not available</span>
      </div>
  );

  switch (slide.layout) {
    case 'section_header':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-brand-bg">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-accent leading-tight">{slide.title}</h2>
          <p className="text-brand-text-secondary text-lg md:text-xl lg:text-2xl mt-4 max-w-3xl">{slide.subtitle}</p>
        </div>
      );

    case 'image_full_bleed':
      return (
        <div className="w-full h-full relative text-white">
          {slide.imageData ? (
            <img src={slide.imageData} alt={slide.title} className="absolute inset-0 w-full h-full object-cover"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col bg-brand-bg text-brand-text-secondary">
                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                <span>Background not available</span>
            </div>
          )}
           <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-3xl md:text-4xl font-bold leading-tight">{slide.title}</h3>
                <p className="text-lg md:text-xl opacity-90 mt-1">{slide.subtitle}</p>
           </div>
        </div>
      );
    
    case 'two_column_text':
      const halfway = Math.ceil(slide.content.length / 2);
      const col1 = slide.content.slice(0, halfway);
      const col2 = slide.content.slice(halfway);
      return (
        <div className="flex-grow flex flex-col p-8 sm:p-10 lg:p-12">
            <h3 className="text-center text-3xl md:text-4xl font-bold text-brand-text-primary leading-tight mb-8">{slide.title}</h3>
            <div className="flex-grow flex flex-row gap-8">
                <div className="w-1/2">
                    <ul className="space-y-3 list-disc list-inside text-brand-text-primary text-base md:text-lg leading-relaxed">
                        {col1.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                </div>
                <div className="w-1/2">
                    <ul className="space-y-3 list-disc list-inside text-brand-text-primary text-base md:text-lg leading-relaxed">
                        {col2.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                </div>
            </div>
        </div>
      );

    case 'image_left_text_right':
        return (
            <div className="flex-grow flex flex-row">
                <div className="w-1/2 relative bg-brand-bg">
                    {slide.imageData ? <img src={slide.imageData} alt={slide.title} className="absolute inset-0 w-full h-full object-cover"/> : imagePlaceholder}
                </div>
                <div className="w-1/2 flex flex-col p-8 sm:p-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-text-primary leading-tight">{slide.title}</h3>
                    {slide.content && slide.content.length > 0 && <div className="mt-6">{contentBody}</div>}
                </div>
            </div>
        );

    case 'quote':
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-brand-bg">
                {slide.content && slide.content.length > 0 && 
                    <blockquote className="text-3xl md:text-4xl lg:text-5xl font-italic text-brand-text-primary leading-tight max-w-4xl">
                        "{slide.content[0]}"
                    </blockquote>
                }
                <cite className="text-brand-accent text-xl md:text-2xl mt-6 font-bold">{slide.subtitle}</cite>
            </div>
        );

    case 'title_and_content':
    default:
      return (
        <div className="flex-grow flex flex-row">
          <div className="w-1/2 flex flex-col p-8 sm:p-10 lg:p-12">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-text-primary leading-tight">{slide.title}</h3>
            <p className="text-brand-text-secondary text-md md:text-lg mt-2 mb-6">{slide.subtitle}</p>
            {slide.content && slide.content.length > 0 && contentBody}
          </div>
          <div className="w-1/2 relative bg-brand-bg">
            {slide.imageData ? <img src={slide.imageData} alt={slide.title} className="absolute inset-0 w-full h-full object-cover"/> : imagePlaceholder }
          </div>
        </div>
      );
  }
};

const Slide: React.FC<SlideProps> = ({ slide, index, totalSlides, template }) => {
  return (
    <div 
      className="bg-brand-surface border border-brand-border rounded-lg shadow-2xl overflow-hidden aspect-[16/9] flex flex-col"
      style={{ fontFamily: template.theme.fontFamily }}
    >
      <SlideLayoutRenderer slide={slide} />
      <footer className="bg-brand-border/30 text-right px-6 py-2">
        <span className="text-sm font-mono text-brand-text-secondary">{index + 1} / {totalSlides}</span>
      </footer>
    </div>
  );
};

export default Slide;