import { AlertTriangle } from 'lucide-react';
import { PHISHING_TACTICS } from '@/lib/constants';

export function EducationalSection() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Common Phishing Tactics</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {PHISHING_TACTICS.map((tactic, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-start">
              <AlertTriangle className="text-amber-500 h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">{tactic.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tactic.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
