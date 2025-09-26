import React from 'react';
import { BugAntIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-medium shadow-lg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <BugAntIcon className="h-8 w-8 text-brand-accent"/>
            <h1 className="ml-3 text-2xl font-bold text-white">
              Multi-Agent Game Tester
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
