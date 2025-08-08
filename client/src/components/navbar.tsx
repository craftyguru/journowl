import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import { useState } from "react";
import { PWAInstallButton } from "@/components/PWAManager";
import { ThemeSelector } from "./theme-selector";


interface NavbarProps {
  currentView: string;
  activeTab?: string;
  onNavigate: (view: string) => void;
}

export default function Navbar({ currentView, activeTab, onNavigate }: NavbarProps) {
  const { colorScheme, toggleColorScheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
  });

  const user = userResponse?.user;

  return (
    <nav className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-lg border-b border-purple-500/20 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="gradient-bg p-2 rounded-lg">
              <span className="text-2xl animate-pulse">🦉</span>
            </div>
            <h1 className="text-xl font-bold text-primary">🦉 JournOwl</h1>
          </div>
          
          {/* Professional Desktop Navigation - All Tabs */}
          <div className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80 backdrop-blur-lg rounded-2xl px-4 py-2 border border-slate-600/30 shadow-2xl">
            <Button
              variant="ghost"
              className={`h-10 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 border ${
                activeTab === "journal" 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/50 border-orange-400/50 transform scale-105' 
                  : 'bg-gradient-to-r from-orange-400/10 to-amber-400/10 text-orange-200 hover:from-orange-400/30 hover:to-amber-400/30 hover:text-white hover:scale-105 border-orange-400/20'
              }`}
              onClick={() => onNavigate("journal")}
            >
              ✍️ Journal
            </Button>
            <Button
              variant="ghost"
              className={`h-10 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 border ${
                activeTab === "analytics" 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 border-blue-400/50 transform scale-105' 
                  : 'bg-gradient-to-r from-blue-400/10 to-cyan-400/10 text-blue-200 hover:from-blue-400/30 hover:to-cyan-400/30 hover:text-white hover:scale-105 border-blue-400/20'
              }`}
              onClick={() => onNavigate("analytics")}
            >
              📊 Analytics
            </Button>
            <Button
              variant="ghost"
              className={`h-10 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 border ${
                activeTab === "achievements" 
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/50 border-yellow-400/50 transform scale-105' 
                  : 'bg-gradient-to-r from-yellow-400/10 to-amber-400/10 text-yellow-200 hover:from-yellow-400/30 hover:to-amber-400/30 hover:text-white hover:scale-105 border-yellow-400/20'
              }`}
              onClick={() => onNavigate("achievements")}
            >
              🏆 Achievements
            </Button>
            <Button
              variant="ghost"
              className={`h-10 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 border ${
                activeTab === "goals" 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 border-green-400/50 transform scale-105' 
                  : 'bg-gradient-to-r from-green-400/10 to-emerald-400/10 text-green-200 hover:from-green-400/30 hover:to-emerald-400/30 hover:text-white hover:scale-105 border-green-400/20'
              }`}
              onClick={() => onNavigate("goals")}
            >
              🎯 Goals
            </Button>
            <Button
              variant="ghost"
              className={`h-10 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 border ${
                activeTab === "insights" 
                  ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/50 border-purple-400/50 transform scale-105' 
                  : 'bg-gradient-to-r from-purple-400/10 to-violet-400/10 text-purple-200 hover:from-purple-400/30 hover:to-violet-400/30 hover:text-white hover:scale-105 border-purple-400/20'
              }`}
              onClick={() => onNavigate("insights")}
            >
              🤖 AI
            </Button>
            
            {/* Secondary Navigation - More Subtle */}
            <div className="flex gap-1 ml-3 pl-3 border-l border-gray-600/30">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "calendar" 
                    ? 'bg-teal-500/70 text-white shadow-sm' 
                    : 'bg-gray-700/20 text-gray-400 hover:bg-gray-600/30 hover:text-gray-200'
                }`}
                onClick={() => onNavigate("calendar")}
                title="Memory Calendar"
              >
                📅
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "stories" 
                    ? 'bg-emerald-500/70 text-white shadow-sm' 
                    : 'bg-gray-700/20 text-gray-400 hover:bg-gray-600/30 hover:text-gray-200'
                }`}
                onClick={() => onNavigate("stories")}
                title="AI Stories"
              >
                📚
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
                  currentView === "referral" 
                    ? 'bg-pink-500/70 text-white shadow-sm' 
                    : 'bg-gray-700/20 text-gray-400 hover:bg-gray-600/30 hover:text-gray-200'
                }`}
                onClick={() => onNavigate("referral")}
                title="Referral Program"
              >
                🎁
              </Button>
            </div>
          </div>
          
          {/* Tablet Navigation - Simplified */}
          <div className="hidden md:flex lg:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`${activeTab === "journal" ? "bg-orange-500 text-white" : "text-muted-foreground hover:text-primary"} rounded-lg`}
              onClick={() => onNavigate("journal")}
            >
              ✍️
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${activeTab === "analytics" ? "bg-blue-500 text-white" : "text-muted-foreground hover:text-primary"} rounded-lg`}
              onClick={() => onNavigate("analytics")}
            >
              📊
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${activeTab === "achievements" ? "bg-yellow-500 text-white" : "text-muted-foreground hover:text-primary"} rounded-lg`}
              onClick={() => onNavigate("achievements")}
            >
              🏆
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${activeTab === "goals" ? "bg-green-500 text-white" : "text-muted-foreground hover:text-primary"} rounded-lg`}
              onClick={() => onNavigate("goals")}
            >
              🎯
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${activeTab === "insights" ? "bg-purple-500 text-white" : "text-muted-foreground hover:text-primary"} rounded-lg`}
              onClick={() => onNavigate("insights")}
            >
              🤖
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <PWAInstallButton />
            
            <ThemeSelector />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleColorScheme}
              className="rounded-lg"
              title="Toggle Dark/Light Mode"
            >
              {colorScheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {user && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    fetch('/api/auth/logout', { 
                      method: 'POST',
                      credentials: 'include'
                    })
                      .then(() => {
                        // Clear any local storage
                        localStorage.clear();
                        sessionStorage.clear();
                        // Force reload to clear cache
                        window.location.href = '/';
                      });
                  }}
                  className="hidden sm:inline-flex text-sm"
                >
                  Logout
                </Button>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="gradient-bg text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-card border-t border-border">
          <div className="px-4 py-2 space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${currentView === "dashboard" && activeTab === "journal" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              📊 Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "journal" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("journal");
                setMobileMenuOpen(false);
              }}
            >
              📝 Journal
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "analytics" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("analytics");
                setMobileMenuOpen(false);
              }}
            >
              📈 Analytics
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "achievements" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("achievements");
                setMobileMenuOpen(false);
              }}
            >
              🏆 Achievements
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "goals" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("goals");
                setMobileMenuOpen(false);
              }}
            >
              🎯 Goals
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "insights" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("insights");
                setMobileMenuOpen(false);
              }}
            >
              🤖 AI Thoughts
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "analytics-insights" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("analytics-insights");
                setMobileMenuOpen(false);
              }}
            >
              📈 Insights
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "calendar" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("calendar");
                setMobileMenuOpen(false);
              }}
            >
              📅 Memory Calendar
            </Button>
            
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "stories" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("stories");
                setMobileMenuOpen(false);
              }}
            >
              📚 AI Stories
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${currentView === "referral" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("referral");
                setMobileMenuOpen(false);
              }}
            >
              🎁 Referral
            </Button>
            
            {/* Mobile Logout Button */}
            {user && (
              <Button
                variant="outline"
                className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 sm:hidden"
                onClick={() => {
                  fetch('/api/auth/logout', { 
                    method: 'POST',
                    credentials: 'include'
                  })
                    .then(() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      setMobileMenuOpen(false);
                      window.location.href = '/';
                    });
                }}
              >
                🚪 Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
