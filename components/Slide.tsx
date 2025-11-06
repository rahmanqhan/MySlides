import React, { useRef, useEffect } from 'react';
import { CardData } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface SlideProps {
  card: CardData;
  index: number;
}

const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

const ImageComponent: React.FC<{ card: CardData }> = ({ card }) => (
    <div className="w-full h-full bg-gray-100 rounded-[1.2em] flex items-center justify-center overflow-hidden border-[0.1em] border-gray-200 shadow-sm">
        {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
        ) : (
            <div className="text-center text-gray-400 animate-pulse p-[1.6em]">
                <ImageIcon className="w-[4.8em] h-[4.8em] mx-auto mb-[0.8em]" />
                <p className="text-[1.4em]">Generating image...</p>
            </div>
        )}
    </div>
);

const Slide: React.FC<SlideProps> = ({ card, index }) => {
  const slideRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slideElement = slideRef.current;
    const textContainer = textContainerRef.current;
    if (!slideElement) return;

    let animationFrameId: number | null = null;

    const autofit = () => {
      // 1. Set base font size for responsive scaling.
      const referenceWidth = 1024; // Corresponds to max-w-5xl
      const baseFontSize = 12;
      const newFontSize = (slideElement.getBoundingClientRect().width / referenceWidth) * baseFontSize;
      slideElement.style.fontSize = `${newFontSize}px`;

      // 2. If a text container exists, perform the overflow check.
      // This logic runs directly within the animation frame, ensuring accurate measurements after the initial font size is applied.
      if (textContainer) {
          const hasOverflow = textContainer.scrollHeight > textContainer.clientHeight + 1;
          if (hasOverflow) {
            let currentSize = newFontSize;
            let iterations = 0;
            const maxIterations = 50; // Safety break.

            // Iteratively reduce font size until the content fits.
            while (
              textContainer.scrollHeight > textContainer.clientHeight + 1 &&
              iterations < maxIterations
            ) {
              currentSize -= 0.2; // Reduce font size by a small step for precision.
              slideElement.style.fontSize = `${currentSize}px`;
              iterations++;
            }
          }
      }
    };

    const handleResize = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(autofit);
    };
    
    // Initial layout and autofit.
    handleResize();

    // Re-run on slide resize.
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(slideElement);

    // Cleanup.
    return () => {
      resizeObserver.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
    
  }, [card.content, card.layout, card.imageUrl]);


  const renderLayout = () => {
    const TextContent = <MarkdownRenderer content={card.content} title={card.title} />;

    switch (card.layout) {
      case 'text_image':
        return (
          <div className="grid grid-cols-5 gap-[2.4em] items-center h-full">
            <div ref={textContainerRef} className="col-span-3 h-full flex flex-col justify-center overflow-hidden">
              {TextContent}
            </div>
            <div className="col-span-2 w-full h-full">
              <ImageComponent card={card} />
            </div>
          </div>
        );

      case 'image_text':
        return (
          <div className="grid grid-cols-5 gap-[2.4em] items-center h-full">
            <div className="col-span-2 w-full h-full">
              <ImageComponent card={card} />
            </div>
            <div ref={textContainerRef} className="col-span-3 h-full flex flex-col justify-center overflow-hidden">
              {TextContent}
            </div>
          </div>
        );
      
      case 'title':
      case 'text_only':
      default:
        // For title, text-only, or any unknown layout, we use a full-bleed background.
        return (
          <div ref={textContainerRef} className="relative z-10 flex flex-col justify-center h-full overflow-hidden p-[4.8em]">
            {TextContent}
          </div>
        );
    }
  };

  const isFullBleed = card.layout === 'title' || card.layout === 'text_only' || !['text_image', 'image_text'].includes(card.layout);

  return (
    <section 
      ref={slideRef}
      className={`presentation-slide rounded-2xl shadow-2xl shadow-black/40 border border-gray-700/10 flex flex-col relative overflow-hidden aspect-[297/210] ${isFullBleed ? 'text-white' : 'bg-white text-gray-900 p-[4.8em]'}`}
    >
      {isFullBleed && (
        <>
          <div className="absolute inset-0 bg-gray-900">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 animate-pulse">
                <ImageIcon className="w-[6.4em] h-[6.4em]" />
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-black/60"></div>
        </>
      )}
      {renderLayout()}
    </section>
  );
};

export default Slide;