
import React from 'react';
import { ArrowLeftIcon, PlusIcon, SparklesIcon, TrashIcon } from './IconComponents';

interface OutlineEditorProps {
  outline: string[];
  setOutline: (outline: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading: boolean;
  topic: string;
}

const OutlineEditor: React.FC<OutlineEditorProps> = ({ outline, setOutline, onContinue, onBack, isLoading, topic }) => {

  const handleEdit = (index: number, value: string) => {
    const newOutline = [...outline];
    newOutline[index] = value;
    setOutline(newOutline);
  };

  const handleAdd = () => {
    setOutline([...outline, 'New slide topic']);
  };

  const handleRemove = (index: number) => {
    const newOutline = outline.filter((_, i) => i !== index);
    setOutline(newOutline);
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-primary">Here's your outline</h2>
        <p className="text-brand-text-secondary mt-2 text-lg">Review and edit the talking points for your presentation on "{topic}".</p>
      </div>

      <div className="w-full bg-brand-surface border border-brand-border rounded-lg p-6 space-y-4 shadow-lg">
        {outline.map((item, index) => (
          <div key={index} className="flex items-center group">
            <span className="text-brand-accent font-bold text-lg mr-4">{index + 1}.</span>
            <input
              type="text"
              value={item}
              onChange={(e) => handleEdit(index, e.target.value)}
              className="flex-grow bg-transparent p-2 border-b-2 border-brand-border focus:outline-none focus:border-brand-accent transition-colors"
            />
            <button
              onClick={() => handleRemove(index)}
              className="ml-4 p-1 text-brand-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove item"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
         <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center mt-4 p-2 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-border/50 rounded-lg transition-colors"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add item
        </button>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center w-full space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-brand-surface text-brand-text-primary font-semibold rounded-lg border border-brand-border hover:bg-brand-border transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-brand-accent text-white font-semibold rounded-lg shadow-md hover:bg-brand-accent-light disabled:bg-gray-500 transition-colors transform hover:scale-105"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Saving...' : 'Choose Template'}
        </button>
      </div>
    </div>
  );
};

export default OutlineEditor;