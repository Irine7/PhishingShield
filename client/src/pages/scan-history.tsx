import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { RiskGauge } from '@/components/ui/risk-gauge';
import { AlertCircle, ArrowRight, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function ScanHistory() {
  const { toast } = useToast();
  
  const { data: scans, isLoading, error } = useQuery<Scan[]>({
    queryKey: ['/api/scans'],
  });

  const deleteScan = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/scans/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/scans'] });
      toast({
        title: 'Scan Deleted',
        description: 'The scan has been removed from history',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete scan',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Scan History</h2>
          <p className="text-gray-600 dark:text-gray-400">View your previous transaction scan results</p>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Scan History</h2>
          <p className="text-gray-600 dark:text-gray-400">View your previous transaction scan results</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Failed to load scan history</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Scan History</h2>
        <p className="text-gray-600 dark:text-gray-400">View your previous transaction scan results</p>
      </div>
      
      {scans && scans.length > 0 ? (
        <div className="space-y-4">
          {scans.map((scan) => {
            const findings = JSON.parse(scan.findings);
            const shortenedData = scan.transactionData.length > 60 
              ? `${scan.transactionData.slice(0, 60)}...` 
              : scan.transactionData;
              
            return (
              <Card key={scan.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">
                      {scan.url || scan.contractAddress || 'Transaction Scan'}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteScan(scan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {scan.createdAt 
                      ? formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true }) 
                      : 'Unknown date'}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono mb-2 truncate">{shortenedData}</p>
                  
                  <div className="mb-4">
                    <RiskGauge riskLevel={scan.riskLevel} />
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Findings: </span>
                    <span>{findings.length} issue{findings.length !== 1 ? 's' : ''} detected</span>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="mt-2">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No scan history available</p>
            <p className="text-sm text-gray-400 mt-1">
              Your previous transaction scans will appear here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
