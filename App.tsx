import React, { useState, useCallback } from 'react';
import { AppState, SlideContent, Template, SlideLayout, SlidePrototype } from './types';
import { generateOutline as genOutline, generateSlides as genSlides, generateImage as genImage } from './services/geminiService';
import { exportToPptx } from './services/pptExporter';
import { templates } from './templates';
import Header from './components/Header';
import TopicInput from './components/TopicInput';
import OutlineEditor from './components/OutlineEditor';
import Loader from './components/Loader';
import PresentationView from './components/PresentationView';
import TemplateSelector from './components/TemplateSelector';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('topic');
  const [topic, setTopic] = useState<string>('');
  const [outline, setOutline] = useState<string[]>([]);
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateOutline = useCallback(async (currentTopic: string) => {
    if (!currentTopic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Generating an outline for you...');
    setError(null);
    setTopic(currentTopic);
    try {
      const generatedOutline = await genOutline(currentTopic);
      setOutline(generatedOutline);
      setAppState('outline');
    } catch (err) {
      setError('Failed to generate outline. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChooseTemplate = useCallback(() => {
    setAppState('template');
  }, []);

  const handleGeneratePresentation = useCallback(async (template: Template) => {
    if (outline.length === 0) {
      setError('The outline is empty. Cannot generate presentation.');
      return;
    }
    setSelectedTemplate(template);
    setAppState('generating');
    setIsLoading(true);
    setLoadingMessage('Crafting your presentation content...');
    setError(null);
    try {
      const slidePrototypes = await genSlides(outline);
      setLoadingMessage('Designing slide layouts...');

      let contentLayoutCounter = 0;
      const mappedSlides: SlideContent[] = slidePrototypes.map((slide) => {
          let layout: SlideLayout = 'title_and_content'; // Default fallback
          const { content: contentLayouts, divider: dividerLayouts, quote: quoteLayouts } = template.availableLayouts;

          switch (slide.slideType) {
              case 'divider':
              case 'introduction':
              case 'conclusion':
                  layout = dividerLayouts[0] || 'section_header';
                  break;
              case 'quote':
                  layout = quoteLayouts[0] || 'quote';
                  break;
              case 'main_point':
                  if (contentLayouts.length > 0) {
                    layout = contentLayouts[contentLayoutCounter % contentLayouts.length];
                    contentLayoutCounter++;
                  }
                  break;
          }
          return { ...slide, layout };
      });

      setLoadingMessage('Generating visuals for your slides...');
      
      const slidesWithImages = await Promise.all(
        mappedSlides.map(async (slide) => {
          try {
            // Avoid generating images for layouts that don't need them
            if (slide.layout === 'two_column_text') {
              return { ...slide, imageData: undefined };
            }
            const imageData = await genImage(slide.image_prompt);
            return { ...slide, imageData };
          } catch (imageError) {
            console.error(`Failed to generate image for slide: "${slide.title}"`, imageError);
            return { ...slide, imageData: undefined };
          }
        })
      );
      
      setSlides(slidesWithImages);
      setAppState('presentation');
    } catch (err)
 {
      setError('Failed to generate the presentation. Please try again.');
      setAppState('template'); // Go back to template selection on error
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [outline]);
  
  const handleExport = useCallback(() => {
    if (!selectedTemplate || slides.length === 0) {
      setError("Cannot export: Missing template or slide data.");
      return;
    }
    try {
        exportToPptx(slides, selectedTemplate, topic);
    } catch (err) {
        setError("An error occurred during the export process.");
        console.error(err);
    }
  }, [slides, selectedTemplate, topic]);

  const handleReset = useCallback(() => {
    setAppState('topic');
    setTopic('');
    setOutline([]);
    setSlides([]);
    setSelectedTemplate(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleBackToOutline = useCallback(() => {
    setAppState('outline');
  }, []);
  
  const handleBackToTemplate = useCallback(() => {
    setAppState('template');
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <Loader message={loadingMessage} />;
    }

    switch (appState) {
      case 'topic':
        return <TopicInput onSubmit={handleGenerateOutline} isLoading={isLoading} />;
      case 'outline':
        return <OutlineEditor
          outline={outline}
          setOutline={setOutline}
          onContinue={handleChooseTemplate}
          onBack={handleReset}
          isLoading={isLoading}
          topic={topic}
        />;
      case 'template':
        return <TemplateSelector 
          templates={templates}
          onGenerate={handleGeneratePresentation}
          onBack={handleBackToOutline}
        />;
      case 'presentation':
        return <PresentationView 
          slides={slides} 
          template={selectedTemplate!}
          onReset={handleReset} 
          onBack={handleBackToTemplate}
          onExport={handleExport}
        />;
      default:
        return <div>Something went wrong. Please refresh.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <Header />
      <main className="w-full max-w-5xl flex-grow flex flex-col items-center justify-center mt-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-center w-full max-w-3xl">
            <p>{error}</p>
          </div>
        )}
        {renderContent()}
      </main>
      <footer className="w-full max-w-5xl text-center py-4 mt-8">
        <p className="text-brand-text-secondary text-sm">Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;