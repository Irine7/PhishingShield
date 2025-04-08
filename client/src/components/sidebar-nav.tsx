import { useLocation, Link } from 'wouter';
import { Shield, History, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

export default function SidebarNav() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: '/', icon: Shield, text: 'Transaction Scanner' },
    { href: '/history', icon: History, text: 'Scan History' },
    { href: '/learning', icon: BookOpen, text: 'Learning Resources' },
    { href: '/settings', icon: Settings, text: 'Settings' },
  ];

  const isActive = (path: string) => location === path;

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-gray-900 shadow-md flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      <div className="p-4 flex items-center border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-lg font-bold">Phishing Detector</h1>
        </div>
      </div>
      
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  className={`w-full justify-start ${isActive(item.href) ? 'bg-primary bg-opacity-10 text-primary' : ''}`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  <span>{item.text}</span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm">Dark Mode</span>
          <div 
            className="relative inline-flex items-center cursor-pointer"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <input 
              type="checkbox" 
              checked={theme === 'dark'} 
              onChange={() => {}} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
