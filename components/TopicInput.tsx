
import React, { useState } from 'react';
import { MagicWandIcon } from './IconComponents';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(topic);
  };

  return (
    <div className="w-full max-w-2xl text-center flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-primary mb-2">Create a presentation about...</h2>
      <p className="text-brand-text-secondary mb-8 text-lg">Just start with a topic, and let AI do the rest.</p>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-brand-surface border border-brand-border rounded-lg p-2 flex items-center shadow-lg focus-within:ring-2 focus-within:ring-brand-accent transition-all duration-300">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The future of renewable energy"
            className="w-full h-24 bg-transparent text-brand-text-primary placeholder-brand-text-secondary resize-none focus:outline-none p-2 text-lg"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-brand-accent text-white font-semibold rounded-lg shadow-md hover:bg-brand-accent-light disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          <MagicWandIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Generating...' : 'Generate Outline'}
        </button>
      </form>
    </div>
  );
};

export default TopicInput;
