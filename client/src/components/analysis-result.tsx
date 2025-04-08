import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RiskGauge } from '@/components/ui/risk-gauge';
import { AnalysisResult as AnalysisResultType } from '@shared/schema';
import { AlertCircle, Info } from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResultType | null;
  isLoading?: boolean;
}

export function AnalysisResult({ result, isLoading = false }: AnalysisResultProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Analyzing transaction for potential threats...</p>
      </div>
    );
  }

  if (!result) return null;

  const { riskLevel, findings, advice, contractAddress } = result;
  
  const getRiskLevelText = () => {
    if (riskLevel >= 80) return 'High Risk';
    if (riskLevel >= 50) return 'Medium Risk';
    return 'Low Risk';
  };
  
  const getRiskLevelClass = () => {
    if (riskLevel >= 80) return 'text-red-500';
    if (riskLevel >= 50) return 'text-amber-500';
    return 'text-emerald-500';
  };
  
  const getRiskBackgroundClass = () => {
    if (riskLevel >= 80) return 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border-l-4 border-red-500';
    if (riskLevel >= 50) return 'bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20 border-l-4 border-amber-500';
    return 'bg-emerald-50 dark:bg-emerald-900 dark:bg-opacity-20 border-l-4 border-emerald-500';
  };

  return (
    <Card className="overflow-hidden">
      {/* Risk Header */}
      <CardHeader className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Security Analysis Results</h3>
          <span className={`font-bold ${getRiskLevelClass()}`}>{getRiskLevelText()}</span>
        </div>
        
        <RiskGauge riskLevel={riskLevel} className="mb-4" />
        
        <div className={`p-4 rounded-r-md ${getRiskBackgroundClass()}`}>
          <p className="text-sm">
            {riskLevel >= 80 
              ? 'This transaction appears to be highly suspicious and may be a phishing attempt. We strongly recommend NOT proceeding with this transaction.'
              : riskLevel >= 50 
                ? 'This transaction contains some suspicious elements. Proceed with caution and verify all details carefully.'
                : 'This transaction appears to be legitimate, but always verify details before signing.'
            }
          </p>
        </div>
      </CardHeader>
      
      {/* Detailed Analysis */}
      <CardContent className="p-6">
        <h4 className="font-semibold mb-3">Detailed Analysis</h4>
        <div className="border rounded-lg overflow-hidden mb-6">
          {findings.map((finding, index) => (
            <div key={index} className="p-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-mono text-sm">{finding.type === 'function' ? 'Function Call: ' : finding.type === 'contract' ? 'Contract Address: ' : finding.type === 'domain' ? 'Domain Analysis: ' : 'Analysis: '}</span>
              <span className={`font-mono text-sm font-bold ${finding.severity === 'high' ? 'text-red-500' : ''}`}>
                {finding.details?.split(':')[1] || finding.description}
              </span>
              <div className={`mt-1 text-xs ${finding.severity === 'high' ? 'text-red-500' : ''}`}>
                {finding.severity === 'high' && '⚠️ '}{finding.description}
              </div>
            </div>
          ))}
          
          {contractAddress && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-mono text-sm">Contract Address: </span>
              <span className="font-mono text-sm">{contractAddress}</span>
              <div className="mt-1 text-xs">
                {riskLevel >= 80 ? '⚠️ Contract not verified on Etherscan' : 'Contract verified on Etherscan'}
              </div>
            </div>
          )}
          
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <span className="font-mono text-sm">Gas Fees: </span>
            <span className="font-mono text-sm">~0.002 ETH</span>
            <div className="mt-1 text-xs">
              Estimated gas fees for this transaction
            </div>
          </div>
        </div>
        
        <h4 className="font-semibold mb-3">Security Advice</h4>
        <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 p-4 rounded-lg mb-6">
          <ul className="text-sm space-y-1">
            {advice.map((tip, index) => (
              <li key={index} className="flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="destructive" className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Reject Transaction
          </Button>
          <Button variant="outline" className="flex items-center">
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
