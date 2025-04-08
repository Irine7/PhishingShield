import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, BookOpen, ExternalLink, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LearningResources() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Learning Resources</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Learn about common phishing tactics and how to protect yourself
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Common Phishing Tactics</CardTitle>
            </div>
            <CardDescription>
              Understanding the methods used by scammers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="text-sm">
                <span className="font-semibold block">Fake Websites:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Scammers create near-identical copies of popular dApps with slight URL differences
                </span>
              </li>
              <li className="text-sm">
                <span className="font-semibold block">Token Approvals:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Malicious contracts request unlimited token allowances to drain wallets later
                </span>
              </li>
              <li className="text-sm">
                <span className="font-semibold block">Blind Signing:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Complex transactions that hide malicious operations behind legitimate-looking requests
                </span>
              </li>
              <li className="text-sm">
                <span className="font-semibold block">Airdrop Scams:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Free token claims that require interacting with malicious contracts
                </span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full mt-4 flex items-center justify-center">
              <span>Learn More</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Best Practices for Security</CardTitle>
            </div>
            <CardDescription>
              How to protect yourself from phishing attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="text-sm">
                <span className="font-semibold block">Verify URLs:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Always double-check the domain name in your browser before connecting your wallet
                </span>
              </li>
              <li className="text-sm">
                <span className="font-semibold block">Use Hardware Wallets:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Hardware wallets provide an extra layer of security by requiring physical confirmation
                </span>
              </li>
              <li className="text-sm">
                <span className="font-semibold block">Limited Approvals:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Only approve what you need to spend, not unlimited amounts
                </span>
              </li>
              <li className="text-sm">
                <span className="font-semibold block">Bookmark Official Sites:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Save bookmarks for dApps you commonly use to avoid typing URLs
                </span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full mt-4 flex items-center justify-center">
              <span>Security Guide</span>
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <CardTitle>Web3 Security Resources</CardTitle>
            </div>
            <CardDescription>
              Trusted sources to learn more about blockchain security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                  MetaMask Security Guide
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Official guidance on how to stay safe while using MetaMask
                </p>
                <Button variant="link" size="sm" className="p-0">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <span>Visit resource</span>
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                  Etherscan Token Approval Checker
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Check and revoke token approvals you've previously granted
                </p>
                <Button variant="link" size="sm" className="p-0">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <span>Visit resource</span>
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                  Crypto Scam Database
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Community-maintained list of known scams and phishing sites
                </p>
                <Button variant="link" size="sm" className="p-0">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <span>Visit resource</span>
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                  Web3 Security Best Practices
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Comprehensive guide to staying safe in the blockchain ecosystem
                </p>
                <Button variant="link" size="sm" className="p-0">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <span>Visit resource</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
