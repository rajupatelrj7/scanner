import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScanForm } from './components/ScanForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ScanHistory } from './components/ScanHistory';
import { scanUrlForVulnerabilities } from './services/geminiService';
import { Vulnerability, ScanResult } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [scanInitiated, setScanInitiated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('scanHistory');
      if (storedHistory) {
        setScanHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse scan history from localStorage", e);
      setScanHistory([]);
    }
  }, []);

  const handleScan = async (url: string) => {
    setIsLoading(true);
    setScanInitiated(true);
    setVulnerabilities([]);
    setError(null);
    setCurrentUrl(url);

    try {
      const results = await scanUrlForVulnerabilities(url);
      setVulnerabilities(results);

      const newScanResult: ScanResult = {
        url,
        timestamp: new Date().toISOString(),
        vulnerabilities: results,
      };
      
      setScanHistory(prevHistory => {
        const updatedHistory = [newScanResult, ...prevHistory].slice(0, 10); // Keep last 10
        localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
      setVulnerabilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (vulnerabilities.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ url: currentUrl, vulnerabilities }, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    const domain = new URL(currentUrl).hostname;
    link.download = `vulnerability_report_${domain}.json`;
    link.click();
  };

  const handleSelectHistory = (result: ScanResult) => {
      setCurrentUrl(result.url);
      setVulnerabilities(result.vulnerabilities);
      setScanInitiated(true);
      setError(null);
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />
        <div className="mt-8">
          <ScanForm onScan={handleScan} isLoading={isLoading} />
        </div>

        {error && (
          <div className="mt-8 max-w-4xl mx-auto p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
            <p className="font-semibold">Scan Failed</p>
            <p>{error}</p>
          </div>
        )}
        
        <ResultsDisplay
          vulnerabilities={vulnerabilities}
          isLoading={isLoading}
          scanInitiated={scanInitiated}
          onExport={handleExport}
        />

        <ScanHistory history={scanHistory} onSelect={handleSelectHistory} />
      </main>
    </div>
  );
};

export default App;
