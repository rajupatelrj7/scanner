
import React from 'react';
import { ScanResult } from '../types';

interface ScanHistoryProps {
  history: ScanResult[];
  onSelect: (result: ScanResult) => void;
}

const TimeAgo: React.FC<{ timestamp: string }> = ({ timestamp }) => {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 5) return <span>just now</span>;
    if (seconds < 60) return <span>{seconds} seconds ago</span>;
  
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return <span>{minutes} minute{minutes > 1 ? 's' : ''} ago</span>;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return <span>{hours} hour{hours > 1 ? 's' : ''} ago</span>;

    const days = Math.floor(hours / 24);
    if (days < 30) return <span>{days} day{days > 1 ? 's' : ''} ago</span>;

    const months = Math.floor(days / 30);
    if (months < 12) return <span>{months} month{months > 1 ? 's' : ''} ago</span>;

    const years = Math.floor(days / 365);
    return <span>{years} year{years > 1 ? 's' : ''} ago</span>;
};


export const ScanHistory: React.FC<ScanHistoryProps> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-300 mb-4">Recent Scans</h2>
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <ul className="divide-y divide-gray-700">
          {history.map((result) => (
            <li key={result.timestamp}>
              <button
                onClick={() => onSelect(result)}
                className="w-full text-left p-4 hover:bg-gray-700/50 focus:outline-none focus:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-cyan-400 truncate">{result.url}</p>
                        <p className="text-sm text-gray-400">
                            {result.vulnerabilities.length} vulnerabilit{result.vulnerabilities.length === 1 ? 'y' : 'ies'} found
                        </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <TimeAgo timestamp={result.timestamp} />
                    </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
