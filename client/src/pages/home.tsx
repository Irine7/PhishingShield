import { useState } from 'react';
import { ScannerForm } from '@/components/scanner-form';
import { AnalysisResult } from '@/components/analysis-result';
import { EducationalSection } from '@/components/educational-section';
import { AnalysisResult as AnalysisResultType } from '@shared/schema';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = (result: AnalysisResultType) => {
    setIsAnalyzing(false);
    setAnalysisResult(result);
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Transaction Scanner</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze transactions to detect potential phishing attempts and security risks
        </p>
      </div>
      
      <ScannerForm 
        onAnalysisComplete={handleAnalysisComplete} 
      />
      
      {isAnalyzing && (
        <div className="mt-6">
          <AnalysisResult result={null} isLoading={true} />
        </div>
      )}
      
      {analysisResult && !isAnalyzing && (
        <div className="mt-6">
          <AnalysisResult result={analysisResult} />
        </div>
      )}
      
      <EducationalSection />
    </div>
  );
}
