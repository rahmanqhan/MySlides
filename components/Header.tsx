import React from 'react';
import { MagicWandIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl">
      <div className="flex items-center justify-center space-x-3">
        <div className="p-2 bg-brand-accent rounded-lg">
           <MagicWandIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-text-primary">
          MySlides
        </h1>
      </div>
    </header>
  );
};

export default Header;