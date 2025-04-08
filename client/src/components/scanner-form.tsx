import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Search, HelpCircle, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '@shared/schema';

interface ScannerFormProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export function ScannerForm({ onAnalysisComplete }: ScannerFormProps) {
  const [transaction, setTransaction] = useState('');
  const { toast } = useToast();

  // Sample phishing transactions for testing
  const mockTransactions = [
    'approve(0xffffffffffffffffffffffffffffffffffffffff, 115792089237316195423570985008687907853269984665640564039457)',
    'https://uniswapp.org/swap?inputCurrency=eth&outputCurrency=0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    '0x25f666Aa45A1E9452F923A6AB547750BBe138B75',
    'User visited wallet-connect.cc trying to connect their wallet'
  ];

  const analyzeTransaction = useMutation({
    mutationFn: async (transaction: string) => {
      const response = await apiRequest('POST', '/api/analyze', { transaction });
      return response.json();
    },
    onSuccess: (data: AnalysisResult) => {
      onAnalysisComplete(data);
      toast({
        title: 'Analysis Complete',
        description: 'Transaction has been analyzed successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    },
  });
  
  // Function to use a random mock transaction
  const useMockTransaction = (autoSubmit = false) => {
    const randomIndex = Math.floor(Math.random() * mockTransactions.length);
    const mockTx = mockTransactions[randomIndex];
    setTransaction(mockTx);
    
    toast({
      title: 'Mock Transaction Loaded',
      description: 'A simulated phishing transaction has been loaded for testing',
    });

    if (autoSubmit) {
      // Wait a short moment to allow the transaction to be set
      setTimeout(() => {
        analyzeTransaction.mutate(mockTx);
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter transaction data, URL, or contract address',
        variant: 'destructive',
      });
      return;
    }
    
    analyzeTransaction.mutate(transaction);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Enter Transaction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="transactionInput" 
              className="block text-sm font-medium mb-2"
            >
              Paste transaction data, URL, or contract address:
            </label>
            <Textarea
              id="transactionInput"
              rows={4}
              placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F.approve(0xffffffffffffffffffffffffffffffffffffffff, 115792089237316195423570985008687907853269984665640564039457)"
              className="w-full"
              value={transaction}
              onChange={(e) => setTransaction(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button 
                type="submit" 
                className="flex items-center" 
                disabled={analyzeTransaction.isPending}
              >
                {analyzeTransaction.isPending ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                <span>Scan for Phishing</span>
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center" 
                onClick={(e) => { e.preventDefault(); useMockTransaction(false); }}
                disabled={analyzeTransaction.isPending}
              >
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                <span>Load Mock Transaction</span>
              </Button>
              
              <Button 
                type="button" 
                variant="destructive" 
                className="flex items-center" 
                onClick={(e) => { e.preventDefault(); useMockTransaction(true); }}
                disabled={analyzeTransaction.isPending}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span>Test Now</span>
              </Button>
            </div>
            
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => toast({
                title: 'How to Use',
                description: 'Enter a transaction hash, URL, or raw transaction data to analyze for potential phishing attempts.',
              })}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
