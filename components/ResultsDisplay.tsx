
import React from 'react';
import { Vulnerability } from '../types';
import { VulnerabilityCard } from './VulnerabilityCard';

interface ResultsDisplayProps {
  vulnerabilities: Vulnerability[];
  isLoading: boolean;
  scanInitiated: boolean;
  onExport: () => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-700/50 rounded-lg"></div>
    ))}
  </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  vulnerabilities,
  isLoading,
  scanInitiated,
  onExport,
}) => {
  if (!scanInitiated) {
    return null;
  }

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">
          Scan Results
        </h2>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {vulnerabilities.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-400">
                        Found {vulnerabilities.length} potential vulnerabilit{vulnerabilities.length === 1 ? 'y' : 'ies'}.
                    </p>
                    <button
                        onClick={onExport}
                        className="px-4 py-2 bg-gray-600 text-sm font-medium text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors"
                    >
                        Export as JSON
                    </button>
                </div>
                <div className="space-y-4">
                  {vulnerabilities.map((vuln, index) => (
                    <VulnerabilityCard key={index} vulnerability={vuln} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-200">No Vulnerabilities Found</h3>
                <p className="mt-1 text-sm text-gray-400">
                  The scan completed successfully and did not detect any potential vulnerabilities.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
