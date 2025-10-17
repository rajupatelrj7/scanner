
import React from 'react';

const ShieldIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-cyan-400"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4">
      <div className="container mx-auto flex items-center justify-center space-x-4">
        <ShieldIcon />
        <div>
          <h1 className="text-3xl font-bold text-gray-100 tracking-wider">
            Gemini Vulnerability Scanner
          </h1>
          <p className="text-sm text-gray-400">
            AI-Powered Web Security Analysis
          </p>
        </div>
      </div>
    </header>
  );
};
