
import React, { useState } from 'react';
import { CardData } from '../types';
import Slide from './Slide';
import { generatePdfFromSlides } from '../services/pdfService';

// Declare external libraries loaded via CDN
declare const jspdf: any;
declare const html2canvas: any;

interface PresentationViewProps {
  cards: CardData[];
  onReset: () => void;
  topic: string;
}

const PresentationView: React.FC<PresentationViewProps> = ({ cards, onReset, topic }) => {
  const [savingProgress, setSavingProgress] = useState<{ message: string; percentage: number } | null>(null);

  const handleSave = async () => {
    if (savingProgress) return;

    setSavingProgress({ message: 'Starting...', percentage: 0 });
    try {
      await generatePdfFromSlides(topic, (progress) => {
        setSavingProgress(progress);
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Sorry, there was an error saving the presentation as a PDF.");
    } finally {
       // Short delay to let the user see the "Finalizing" or 100% message
      setTimeout(() => {
        setSavingProgress(null);
      }, 500);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-y-auto font-sans animate-fade-in">
      <header className="fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-md border-b border-white/10 shadow-sm p-2 sm:p-4 flex justify-between items-center z-50 transition-all duration-300">
        <h1
          className="text-lg sm:text-2xl text-white font-bold tracking-widest"
          style={{ fontFamily: 'Michroma, sans-serif' }}
        >
          MySlides
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onReset}
            className="bg-white/10 text-white font-semibold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all text-xs sm:text-sm"
          >
            Create New
          </button>
          <button
            onClick={handleSave}
            disabled={!!savingProgress}
            className="relative bg-indigo-600 text-white font-semibold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg border border-indigo-500 hover:bg-indigo-700 transition-all text-xs sm:text-sm disabled:bg-indigo-500 disabled:cursor-wait min-w-[100px] sm:min-w-[150px] flex items-center justify-center overflow-hidden"
          >
            {savingProgress ? (
              <>
                {/* Progress Bar Background */}
                <div
                  className="absolute top-0 left-0 h-full bg-indigo-700/60 transition-all duration-300 ease-linear"
                  style={{ width: `${savingProgress.percentage}%` }}
                ></div>
                {/* Progress Text */}
                <span className="relative z-10 truncate">{savingProgress.message}</span>
              </>
            ) : (
              'Save as PDF'
            )}
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          {cards.map((card, index) => (
            <Slide key={card.id} card={card} index={index + 1} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PresentationView;