import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { Sun, Moon, Menu, X, BookOpen, TrendingUp, Target, Award, Brain } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import { useState } from "react";
import { PWAInstallButton } from "@/components/PWAManager";
import { ThemeSelector } from "./theme-selector";
import { motion } from "framer-motion";


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

  const navigationTabs = [
    { id: 'journal', label: 'Journal', icon: '✍️', emoji: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📊', emoji: '📈' },
    { id: 'achievements', label: 'Achievements', icon: '🏆', emoji: '🏆' },
    { id: 'goals', label: 'Goals', icon: '🎯', emoji: '🎯' },
    { id: 'insights', label: 'AI', icon: '🤖', emoji: '🤖' },
  ];

  return (
    <nav className="bg-white dark:bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <motion.div
            className="flex items-center gap-3 flex-shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl sm:text-3xl">🦉</div>
            <div>
              <h1 
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                style={{ fontFamily: '"Rock Salt", cursive' }}
              >
                JournOwl
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Your Wise Writing Companion
              </p>
            </div>
          </motion.div>
          
          {/* Professional Tab Navigation - Desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-lg border-2 border-purple-500/20 shadow-2xl rounded-2xl p-3 gap-2">
              {navigationTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`relative flex-shrink-0 h-12 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap overflow-hidden min-w-[120px] justify-center border ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/50 border-orange-400/50 transform scale-105' 
                      : 'bg-gradient-to-r from-orange-400/10 to-amber-400/10 text-orange-200 hover:from-orange-400/30 hover:to-amber-400/30 hover:text-white hover:scale-105 border-orange-400/20'
                  }`}
                  whileHover={{ scale: activeTab === tab.id ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{
                      scale: activeTab === tab.id ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: activeTab === tab.id ? Infinity : 0,
                      repeatType: "reverse"
                    }}
                  >
                    <motion.span 
                      className="text-lg"
                      animate={{
                        rotate: activeTab === tab.id ? [0, 10, -10, 0] : 0,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: activeTab === tab.id ? Infinity : 0,
                        repeatType: "reverse"
                      }}
                    >
                      {tab.icon}
                    </motion.span>
                    <span className="relative" style={{ fontFamily: '"Rock Salt", cursive' }}>
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          className="absolute -inset-1 bg-white/20 rounded blur-sm"
                          animate={{
                            opacity: [0.3, 0.7, 0.3],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        />
                      )}
                    </span>
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Mobile Tab Navigation - Horizontal Scroll */}
            <div className="lg:hidden flex gap-1 overflow-x-auto scrollbar-none max-w-[200px] sm:max-w-[300px]">
              {navigationTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{tab.emoji}</span>
                </motion.button>
              ))}
            </div>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="hidden sm:block">
              <PWAInstallButton />
            </div>
            
            <div className="hidden sm:block">
              <ThemeSelector />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleColorScheme}
              className="rounded-lg w-8 h-8 sm:w-10 sm:h-10"
              title="Toggle Dark/Light Mode"
            >
              {colorScheme === "dark" ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
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
        <div className="lg:hidden bg-white dark:bg-card border-t border-border">
          <div className="px-4 py-2 space-y-2">
            {/* Main Navigation Tabs */}
            {navigationTabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === tab.id ? "text-primary bg-primary/10" : "text-muted-foreground"
                } hover:text-primary`}
                onClick={() => {
                  onNavigate(tab.id);
                  setMobileMenuOpen(false);
                }}
              >
                {tab.emoji} {tab.label}
              </Button>
            ))}
            
            {/* Secondary Navigation */}
            <div className="border-t border-border pt-2 mt-2">
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
            </div>
            
            {/* Mobile Theme & Utilities */}
            <div className="border-t border-border pt-2 mt-2 flex gap-2">
              <div className="flex-1">
                <PWAInstallButton />
              </div>
              <div className="flex-1">
                <ThemeSelector />
              </div>
            </div>
            
            {/* Mobile Logout Button */}
            {user && (
              <Button
                variant="outline"
                className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 sm:hidden mt-2"
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
