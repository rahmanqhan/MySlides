
import React, { useState, useCallback } from 'react';
import { AppState, CardData } from './types';
import PromptScreen from './components/PromptScreen';
import LoadingScreen from './components/LoadingScreen';
import PresentationView from './components/PresentationView';
import { generatePresentationText, generatePresentationImages } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [presentation, setPresentation] = useState<CardData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [topic, setTopic] = useState<string>('');

  const handleGenerate = useCallback(async (newTopic: string) => {
    setAppState(AppState.GENERATING);
    setTopic(newTopic);
    setError(null);
    setPresentation([]);

    try {
      // 1. Await only the text generation, which is fast.
      const initialCards = await generatePresentationText(
        newTopic,
        (message) => setLoadingMessage(message)
      );

      // 2. Immediately set presentation data and switch to the editor view.
      setPresentation(initialCards);
      setAppState(AppState.EDITOR);

      // 3. Trigger image generation in the background (fire and forget).
      // This will update the presentation state as images are generated.
      generatePresentationImages(initialCards, (updatedCard) => {
        setPresentation(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAppState(AppState.INITIAL);
    }
  }, []);

  const handleReset = () => {
    setAppState(AppState.INITIAL);
    setPresentation([]);
    setError(null);
    setLoadingMessage('');
    setTopic('');
  };

  if (appState === AppState.EDITOR) {
    return <PresentationView cards={presentation} onReset={handleReset} topic={topic} />;
  }

  return (
  <div className="h-screen w-full flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-3xl backdrop-saturate-150 text-white">

       {appState === AppState.GENERATING ? (
          <LoadingScreen message={loadingMessage} />
        ) : (
          <PromptScreen onGenerate={handleGenerate} error={error} />
        )}
    </div>
  );
};

export default App;