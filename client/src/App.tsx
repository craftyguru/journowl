import { useState, useEffect } from "react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { getCurrentUser } from "@/lib/auth";
import { checkForPWAUpdate, clearPWACache } from "@/lib/pwa-utils";
import { apiRequest } from "@/lib/queryClient";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import InsightsPage from "@/pages/insights";
import Navbar from "@/components/navbar";
import AccountSelector from "@/components/account-selector";
import AdminDashboard from "@/components/admin-dashboard";
import EnhancedDashboard from "@/components/enhanced-dashboard";
import KidDashboard from "@/components/kid-dashboard";
import ReferralPage from "@/components/referral-page";
import LandingHero from "@/components/ui/LandingHero";

import { StarryBackground } from "@/components/starry-background";
import { PWAUpdateBanner } from "@/components/PWAUpdateBanner";
import { PWAMobilePrompt } from "@/components/PWAManager";

import { EmailConfirmation } from "@/pages/email-confirmation";
import EmailVerified from "@/pages/email-verified";
import ImportPage from "@/pages/ImportPage";
import SharePage from "@/pages/SharePage";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms";
import { FAQ } from "@/components/FAQ";

function App() {
  // Check if demo mode is requested from URL params
  const [currentView, setCurrentView] = useState<"dashboard" | "insights" | "referral" | "demo" | "landing" | "auth" | "email-confirmation" | "email-verified" | "import" | "share" | "privacy-policy" | "terms" | "faq">(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('App initializing - pathname:', window.location.pathname, 'search:', window.location.search);
    if (urlParams.get('demo') === 'true') return 'demo';
    if (urlParams.get('email') && urlParams.get('username')) return 'email-confirmation';
    if (window.location.pathname === '/login' || window.location.pathname === '/signin' || window.location.pathname === '/auth') return 'auth';
    if (window.location.pathname === '/register' || window.location.pathname === '/signup') return 'auth';
    if (window.location.pathname === '/import') return 'import';
    if (window.location.pathname === '/share') return 'share';
    if (window.location.pathname === '/privacy-policy') return 'privacy-policy';
    if (window.location.pathname === '/terms') return 'terms';
    if (window.location.pathname === '/faq' || window.location.pathname === '/help') return 'faq';
    if (window.location.pathname === '/email-verified' || urlParams.get('success') === '1' || urlParams.get('success') === '0' || urlParams.get('verified') === 'true') {
      console.log('Email verified view detected');
      return 'email-verified';
    }
    // Default to landing page for new users
    return 'landing';
  });
  const [selectedAccount, setSelectedAccount] = useState<{type: string, username: string} | null>(null);
  const [activeTab, setActiveTab] = useState("journal");
  
  const handleNavigate = (view: string) => {
    // Handle tab navigation within dashboard
    const tabOptions = ["journal", "analytics", "achievements", "goals", "insights", "analytics-insights", "calendar", "stories", "referral"];
    
    if (tabOptions.includes(view)) {
      setActiveTab(view);
      setCurrentView("dashboard");
    } else if (view === "dashboard" || view === "insights" || view === "referral" || view === "demo" || view === "landing" || view === "auth" || view === "import" || view === "share" || view === "privacy-policy" || view === "terms" || view === "faq") {
      setCurrentView(view);
      if (view === "dashboard") setActiveTab("journal");
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
    console.log('🔧 handleAuthenticated called - setting isAuthenticated to true and currentView to dashboard');
    setIsAuthenticated(true);
    // Clear any cached auth status
    queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    // Scroll to top when redirecting to dashboard
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView("dashboard"); // Immediately redirect to dashboard after login
  };

  const handleLogout = () => {
    console.log('🔧 Logout triggered - clearing auth state');
    setIsAuthenticated(false);
    setCurrentView("auth");
    // Clear all cached data
    queryClient.clear();
  };

  // Check authentication status on app load (DISABLED AUTO-RECOVERY)
  useEffect(() => {
    console.log('🔧 useEffect triggered - currentView:', currentView, 'isAuthenticated:', isAuthenticated);
    
    // Initialize PWA auto-update system
    checkForPWAUpdate();
    
    // Don't override email-verified view with auth check
    if (currentView === "email-verified") {
      console.log('🔧 Skipping auth check for email-verified view');
      setIsAuthenticated(false);
      return;
    }
    
    // Don't check auth for auth page - let it render
    if (currentView === "auth") {
      console.log('🔧 Skipping auth check for auth page');
      setIsAuthenticated(false);
      return;
    }
    
    // AUTO-RECOVERY DISABLED - Don't automatically check authentication
    // User must manually log in
    if (isAuthenticated === null) {
      console.log('🔧 Auto-recovery disabled - setting as not authenticated');
      setIsAuthenticated(false);
    }
  }, [currentView]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  // Privacy Policy page (no auth required)
  if (currentView === "privacy-policy") {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <PrivacyPolicy />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Terms of Service page (no auth required)
  if (currentView === "terms") {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <TermsOfService />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // FAQ page (no auth required)
  if (currentView === "faq") {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <FAQ />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Landing page for new users
  if (!isAuthenticated && currentView === "landing") {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <StarryBackground />
            <Toaster />
            <LandingHero 
              onGetStarted={() => setCurrentView("auth")} 
            />

          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Email confirmation page
  if (!isAuthenticated && currentView === "email-confirmation") {
    const urlParams = new URLSearchParams(window.location.search);
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <StarryBackground />
            <Toaster />
            <EmailConfirmation 
              email={urlParams.get('email') || undefined}
              username={urlParams.get('username') || undefined}
            />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Email verified page - Show regardless of auth status
  if (currentView === "email-verified") {
    console.log('Rendering EmailVerified component');
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <StarryBackground />
            <Toaster />
            <EmailVerified />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Authentication page
  if (!isAuthenticated && currentView === "auth") {
    console.log('Rendering auth page - isAuthenticated:', isAuthenticated, 'currentView:', currentView);
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <StarryBackground />
            <Toaster />
            <div className="min-h-screen">
              <div className="fixed top-4 left-4 z-50">
                <button
                  onClick={() => setCurrentView("landing")}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  ← Back to Home
                </button>
              </div>
              <AuthPage 
                setShowAuth={() => setCurrentView("landing")} 
                onRegistrationSuccess={(email, username) => {
                  // Redirect to email confirmation page
                  const params = new URLSearchParams();
                  if (email) params.set('email', email);
                  if (username) params.set('username', username);
                  window.history.pushState({}, '', `/?${params.toString()}`);
                  setCurrentView("email-confirmation");
                }}
                onAuthenticated={handleAuthenticated}
              />
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

  if (!isAuthenticated && selectedAccount) {
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
                    onClick={() => setCurrentView("auth")}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Try Real Auth
                  </button>
                </div>
                
                <main>
                  {selectedAccount.type === "admin" && <AdminDashboard />}
                  {selectedAccount.type === "user" && currentView === "dashboard" && <EnhancedDashboard onSwitchToKid={() => {}} />}
                  {selectedAccount.type === "user" && currentView === "insights" && <InsightsPage />}
                  {selectedAccount.type === "kid" && <KidDashboard />}
                </main>
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      );
  }

  // Fallback: if not authenticated and no specific view, show landing
  if (!isAuthenticated) {
    console.log('Fallback triggered, showing landing. CurrentView:', currentView);
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <StarryBackground />
            <Toaster />
            <LandingHero 
              onGetStarted={() => setCurrentView("auth")} 
            />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <PWAUpdateBanner />
          <PWAMobilePrompt />
          <Toaster />
          <AuthenticatedApp currentView={currentView} activeTab={activeTab} onNavigate={handleNavigate} />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Authenticated App Component with Role-Based Access
function AuthenticatedApp({ currentView, activeTab, onNavigate }: { currentView: string, activeTab: string, onNavigate: (view: string) => void }) {
  const [isKidMode, setIsKidMode] = useState(false);
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/me'],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !user) {
    // User is not authenticated, redirect to landing page without auto-recovery
    console.log('User not authenticated, redirecting to landing:', error);
    window.location.href = '/';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Admin Dashboard for admin users
  if ((user as any)?.user?.role === 'admin' || (user as any)?.role === 'admin') {
    return (
      <div className="min-h-screen">
        <AdminDashboard />
      </div>
    );
  }

  // Regular app interface for standard users
  // Ensure we always show dashboard as default for authenticated users
  const validView = (currentView === "dashboard" || currentView === "insights" || currentView === "referral") ? currentView : "dashboard";
  
  return (
    <div className="min-h-screen bg-background">
      {!isKidMode && <Navbar currentView={validView} activeTab={activeTab} onNavigate={onNavigate} />}
      <main>
        {isKidMode ? (
          <KidDashboard onSwitchToAdult={() => setIsKidMode(false)} />
        ) : (
          <>
            {validView === "dashboard" && <EnhancedDashboard onSwitchToKid={() => setIsKidMode(true)} initialTab={activeTab} />}
            {validView === "insights" && <InsightsPage />}
            {validView === "referral" && <ReferralPage />}
          </>
        )}
      </main>

      {/* PWA install functionality is now handled by PWAInstallButton in navbar */}
    </div>
  );
}

export default App;
