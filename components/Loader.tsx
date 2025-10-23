
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-xl font-semibold text-brand-text-primary">{message}</p>
    </div>
  );
};

export default Loader;
