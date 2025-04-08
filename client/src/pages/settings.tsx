import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    autoscan: true,
    notificationsEnabled: true,
    riskThreshold: 60,
    saveHistory: true,
  });

  const handleSaveSettings = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated',
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your phishing detection preferences
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>
              Configure application behavior and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                <p className="text-sm text-gray-500">Switch between light and dark theme</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoscan" className="text-base">Auto-Scan Clipboard</Label>
                <p className="text-sm text-gray-500">Automatically detect and scan transactions</p>
              </div>
              <Switch 
                id="autoscan" 
                checked={settings.autoscan}
                onCheckedChange={(checked) => setSettings({...settings, autoscan: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
                <p className="text-sm text-gray-500">Receive alerts for high-risk transactions</p>
              </div>
              <Switch 
                id="notifications" 
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => setSettings({...settings, notificationsEnabled: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="save-history" className="text-base">Save Scan History</Label>
                <p className="text-sm text-gray-500">Keep records of previous transaction scans</p>
              </div>
              <Switch 
                id="save-history" 
                checked={settings.saveHistory}
                onCheckedChange={(checked) => setSettings({...settings, saveHistory: checked})}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Risk Detection Settings</CardTitle>
            <CardDescription>
              Configure how risk is evaluated and displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="risk-threshold" className="text-base">Risk Threshold Alert</Label>
                <span className="text-sm font-medium">{settings.riskThreshold}%</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Set the risk level threshold for transaction alerts
              </p>
              <Slider
                id="risk-threshold"
                defaultValue={[settings.riskThreshold]}
                max={100}
                step={5}
                onValueChange={(value) => setSettings({...settings, riskThreshold: value[0]})}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low (0%)</span>
                <span>Medium (50%)</span>
                <span>High (100%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
