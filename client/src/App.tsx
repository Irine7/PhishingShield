import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ScanHistory from "@/pages/scan-history";
import LearningResources from "@/pages/learning-resources";
import Settings from "@/pages/settings";
import SidebarNav from "@/components/sidebar-nav";

function Router() {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/history" component={ScanHistory} />
            <Route path="/learning" component={LearningResources} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
