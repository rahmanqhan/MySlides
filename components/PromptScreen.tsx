
import React, { useState, useEffect } from 'react';

interface PromptScreenProps {
  onGenerate: (topic: string) => void;
  error: string | null;
}

const prompts = [
  "AI in software",  
  "Cloud computing",  
  "Web development",  
  "Cybersecurity",  
  "Machine learning",  
  "DevOps workflow",   
  "API integration",  
  "Data visualization",  
  "Automation tools",  
  "Blockchain basics",  
  "IoT systems",  
  "UI/UX design",  
  "Cloud security",  
  "Software testing",  
  "Data analytics",  
  "Neural networks",   
  "Database systems",
];

const PromptScreen: React.FC<PromptScreenProps> = ({ onGenerate, error }) => {
  const [topic, setTopic] = useState('');
  
  // Typewriter effect state
  const [promptIndex, setPromptIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [placeholder, setPlaceholder] = useState('');

  // Effect to manage typing/deleting logic and timing
  useEffect(() => {
    // If we've finished typing a prompt, pause, then start deleting
    if (!isDeleting && subIndex === prompts[promptIndex].length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1200); // Pause for 1.2 seconds
      return () => clearTimeout(timeout);
    }

    // If we've finished deleting, move to the next prompt and start typing
    if (isDeleting && subIndex === 0) {
      setIsDeleting(false);
      setPromptIndex((prevIndex) => (prevIndex + 1) % prompts.length);
      return; // Return to avoid setting another timeout
    }

    // Set timeout for the next character change
    const timeout = setTimeout(() => {
      setSubIndex((prevSubIndex) => prevSubIndex + (isDeleting ? -1 : 1));
    }, isDeleting ? 30 : 50); // Delete faster (30ms) than typing (50ms)

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, promptIndex]);

  // Effect to update the actual placeholder string based on the typing state
  useEffect(() => {
    const currentPrompt = prompts[promptIndex];
    const currentText = currentPrompt.substring(0, subIndex);
    setPlaceholder(`e.g., ${currentText}`);
  }, [subIndex, promptIndex]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl text-center flex flex-col items-center justify-center animate-fade-in p-4">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-michroma mb-4 sm:mb-6 tracking-wider logo-animated-gradient leading-tight sm:leading-normal pb-2">MySlides</h1>
      
      <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-lg">
        Say it once. Get your slides in seconds.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
       <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md p-2 sm:p-3 rounded-xl shadow-lg border border-white/30 hover:border-white/60 transition-all duration-500">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={placeholder}
            className="w-0 flex-grow p-2 sm:p-3 bg-transparent focus:outline-none text-gray-200 placeholder-gray-500 text-base sm:text-lg"
            aria-label="Presentation topic"
          />
          <button
            type="submit"
            disabled={!topic.trim()}
            className="font-semibold px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors
                       bg-[#4A4E69] text-gray-200
                       hover:bg-[#5a5f82]
                       disabled:bg-[#393b4a] disabled:text-gray-500 disabled:cursor-not-allowed
                       flex-shrink-0"
            aria-label="Generate presentation"
          >
            Generate
          </button>
        </div>
      </form>

      {error && <p className="text-red-400 mt-6">{error}</p>}
    </div>
    
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 text-gray-600 text-sm font-sans">
        @rahmanqhan
      </div>
    </>
  );
};

export default PromptScreen;
