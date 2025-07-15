import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { getCurrentUser } from "@/lib/auth";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import InsightsPage from "@/pages/insights";
import Navbar from "@/components/navbar";
import AccountSelector from "@/components/account-selector";
import AdminDashboard from "@/components/admin-dashboard";
import EnhancedDashboard from "@/components/enhanced-dashboard";
import KidDashboard from "@/components/kid-dashboard";

function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "insights" | "demo" | "landing">("landing");
  const [selectedAccount, setSelectedAccount] = useState<{type: string, username: string} | null>(null);
  
  const handleNavigate = (view: string) => {
    if (view === "dashboard" || view === "insights" || view === "demo" || view === "landing") {
      setCurrentView(view);
    }
  };

  const handleSelectAccount = (accountType: string, username: string) => {
    setSelectedAccount({ type: accountType, username });
    setCurrentView("dashboard");
  };

  const handleBackToDemo = () => {
    setSelectedAccount(null);
    setCurrentView("demo");
  };

  const handleBackToLanding = () => {
    setSelectedAccount(null);
    setCurrentView("landing");
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Check auth status on load

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // Check authentication status on app load
  useEffect(() => {
    getCurrentUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  // Landing page for new users
  if (!isAuthenticated && currentView === "landing") {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <LandingPage 
              onGetStarted={() => setCurrentView("auth")} 
              onTryDemo={() => setCurrentView("demo")}
            />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Authentication page
  if (!isAuthenticated && currentView === "auth") {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              <div className="fixed top-4 left-4 z-50">
                <button
                  onClick={() => setCurrentView("landing")}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  ← Back to Home
                </button>
              </div>
              <AuthPage onAuthenticated={handleAuthenticated} />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Demo mode - show account selector or demo dashboards
  if (!isAuthenticated && currentView === "demo" && !selectedAccount) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              <div className="fixed top-4 left-4 z-50">
                <button
                  onClick={() => setCurrentView("landing")}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  ← Back to Home
                </button>
              </div>
              <AccountSelector onSelectAccount={handleSelectAccount} />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

    if (selectedAccount) {
      return (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <div className="min-h-screen">
                {/* Demo Navigation */}
                <div className="fixed top-4 left-4 z-50">
                  <button
                    onClick={handleBackToDemo}
                    className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                  >
                    ← Back to Account Selection
                  </button>
                </div>
                <div className="fixed top-4 right-4 z-50 flex gap-2">
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className={`px-4 py-2 backdrop-blur-md border border-white/20 rounded-lg transition-all ${
                      currentView === "dashboard" ? "bg-purple-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentView("insights")}
                    className={`px-4 py-2 backdrop-blur-md border border-white/20 rounded-lg transition-all ${
                      currentView === "insights" ? "bg-purple-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Insights
                  </button>
                  <button
                    onClick={() => handleAuthenticated()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Try Real Auth
                  </button>
                </div>
                
                <main>
                  {selectedAccount.type === "admin" && <AdminDashboard />}
                  {selectedAccount.type === "user" && currentView === "dashboard" && <EnhancedDashboard />}
                  {selectedAccount.type === "user" && currentView === "insights" && <InsightsPage />}
                  {selectedAccount.type === "kid" && <KidDashboard />}
                </main>
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      );
    }

    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <AuthPage onAuthenticated={handleAuthenticated} />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen bg-background">
            <Navbar currentView={currentView} onNavigate={handleNavigate} />
            <main>
              {currentView === "dashboard" && <Dashboard />}
              {currentView === "insights" && <InsightsPage />}
            </main>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
