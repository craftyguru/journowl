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
    <nav className="bg-white dark:bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="gradient-bg p-2 rounded-lg">
              <span className="text-2xl animate-pulse">🦉</span>
            </div>
            <h1 className="text-xl font-bold text-primary">🦉 JournOwl</h1>
          </div>
          
          {/* Desktop Tab Navigation - Ultra Compact */}
          <div className="hidden md:flex items-center space-x-0">
            <Button
              variant="ghost"
              size="sm"
              className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "journal" ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
              onClick={() => {
                onNavigate("journal");
                setTimeout(() => {
                  // Find the specific tab content section
                  const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                       document.querySelector('[data-tabs-content][value="journal"]');
                  
                  if (tabsContainer) {
                    // Calculate position to scroll past the calendar insights section
                    const rect = tabsContainer.getBoundingClientRect();
                    const scrollTop = window.pageYOffset + rect.top - 100; // 100px offset from top
                    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                  } else {
                    // Fallback: scroll to a reasonable position past header elements
                    const headerHeight = 400; // Approximate height of stats + usage meters + insights
                    window.scrollTo({ top: headerHeight, behavior: 'smooth' });
                  }
                }, 300);
              }}
            >
              ✍️ Journal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "analytics" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
              onClick={() => {
                onNavigate("analytics");
                setTimeout(() => {
                  const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                       document.querySelector('[data-tabs-content][value="analytics"]');
                  
                  if (tabsContainer) {
                    const rect = tabsContainer.getBoundingClientRect();
                    const scrollTop = window.pageYOffset + rect.top - 100;
                    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                  } else {
                    const headerHeight = 400;
                    window.scrollTo({ top: headerHeight, behavior: 'smooth' });
                  }
                }, 300);
              }}
            >
              📊 Analytics
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "achievements" ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
              onClick={() => {
                onNavigate("achievements");
                setTimeout(() => {
                  const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                       document.querySelector('[data-tabs-content][value="achievements"]');
                  
                  if (tabsContainer) {
                    const rect = tabsContainer.getBoundingClientRect();
                    const scrollTop = window.pageYOffset + rect.top - 100;
                    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                  } else {
                    const headerHeight = 400;
                    window.scrollTo({ top: headerHeight, behavior: 'smooth' });
                  }
                }, 300);
              }}
            >
              🏆 Awards
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "goals" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
              onClick={() => {
                onNavigate("goals");
                setTimeout(() => {
                  const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                       document.querySelector('[data-tabs-content][value="goals"]');
                  
                  if (tabsContainer) {
                    const rect = tabsContainer.getBoundingClientRect();
                    const scrollTop = window.pageYOffset + rect.top - 100;
                    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                  } else {
                    const headerHeight = 400;
                    window.scrollTo({ top: headerHeight, behavior: 'smooth' });
                  }
                }, 300);
              }}
            >
              🎯 Goals
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "insights" ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
              onClick={() => {
                onNavigate("insights");
                setTimeout(() => {
                  const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                       document.querySelector('[data-tabs-content][value="insights"]');
                  
                  if (tabsContainer) {
                    const rect = tabsContainer.getBoundingClientRect();
                    const scrollTop = window.pageYOffset + rect.top - 100;
                    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                  } else {
                    const headerHeight = 400;
                    window.scrollTo({ top: headerHeight, behavior: 'smooth' });
                  }
                }, 300);
              }}
            >
              🤖 AI
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "calendar" ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
              onClick={() => {
                onNavigate("calendar");
                setTimeout(() => {
                  const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                       document.querySelector('[data-tabs-content][value="calendar"]');
                  
                  if (tabsContainer) {
                    const rect = tabsContainer.getBoundingClientRect();
                    const scrollTop = window.pageYOffset + rect.top - 100;
                    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                  } else {
                    const headerHeight = 400;
                    window.scrollTo({ top: headerHeight, behavior: 'smooth' });
                  }
                }, 300);
              }}
            >
              📅 Memory
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "stories" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
              onClick={() => {
                onNavigate("stories");
                setTimeout(() => {
                  const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                       document.querySelector('[data-tabs-content][value="stories"]');
                  
                  if (tabsContainer) {
                    const rect = tabsContainer.getBoundingClientRect();
                    const scrollTop = window.pageYOffset + rect.top - 100;
                    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                  } else {
                    const headerHeight = 400;
                    window.scrollTo({ top: headerHeight, behavior: 'smooth' });
                  }
                }, 300);
              }}
            >
              📚 Stories
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "referral" ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
              onClick={() => {
                onNavigate("referral");
                setTimeout(() => {
                  const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                       document.querySelector('[data-tabs-content][value="referral"]');
                  
                  if (tabsContainer) {
                    const rect = tabsContainer.getBoundingClientRect();
                    const scrollTop = window.pageYOffset + rect.top - 100;
                    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                  } else {
                    const headerHeight = 400;
                    window.scrollTo({ top: headerHeight, behavior: 'smooth' });
                  }
                }, 300);
              }}
            >
              🎁 Referral
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
            {/* Core Features */}
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-2">
              📝 Writing & Analytics
            </div>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "journal" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("journal");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const element = document.querySelector('[data-tabs-content][value="journal"]');
                  if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const elementTop = elementRect.top + window.pageYOffset;
                    const viewportHeight = window.innerHeight;
                    const offsetTop = elementTop - (viewportHeight / 2) + 100;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              ✍️ Journal
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "analytics" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("analytics");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const element = document.querySelector('[data-tabs-content][value="analytics"]');
                  if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const elementTop = elementRect.top + window.pageYOffset;
                    const viewportHeight = window.innerHeight;
                    const offsetTop = elementTop - (viewportHeight / 2) + 100;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              📊 Analytics
            </Button>
            
            {/* Progress & Achievements */}
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-2 mt-4">
              🏆 Progress & Goals
            </div>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "achievements" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("achievements");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const element = document.querySelector('[data-tabs-content][value="achievements"]');
                  if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const elementTop = elementRect.top + window.pageYOffset;
                    const viewportHeight = window.innerHeight;
                    const offsetTop = elementTop - (viewportHeight / 2) + 100;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                  }
                }, 100);
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
                setTimeout(() => {
                  const element = document.querySelector('[data-tabs-content][value="goals"]');
                  if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const elementTop = elementRect.top + window.pageYOffset;
                    const viewportHeight = window.innerHeight;
                    const offsetTop = elementTop - (viewportHeight / 2) + 100;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              🎯 Goals
            </Button>
            
            {/* AI Features */}
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-2 mt-4">
              🤖 AI Features
            </div>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "insights" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("insights");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const element = document.querySelector('[data-tabs-content][value="insights"]');
                  if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const elementTop = elementRect.top + window.pageYOffset;
                    const viewportHeight = window.innerHeight;
                    const offsetTop = elementTop - (viewportHeight / 2) + 100;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              🤖 AI Thoughts
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "stories" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("stories");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const element = document.querySelector('[data-tabs-content][value="stories"]');
                  if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const elementTop = elementRect.top + window.pageYOffset;
                    const viewportHeight = window.innerHeight;
                    const offsetTop = elementTop - (viewportHeight / 2) + 100;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              📚 AI Stories
            </Button>
            
            {/* Memory & Organization */}
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-2 mt-4">
              📅 Memory & More
            </div>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "calendar" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("calendar");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const element = document.querySelector('[data-tabs-content][value="calendar"]');
                  if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const elementTop = elementRect.top + window.pageYOffset;
                    const viewportHeight = window.innerHeight;
                    const offsetTop = elementTop - (viewportHeight / 2) + 100;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              📅 Memory Calendar
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${currentView === "referral" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("referral");
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const element = document.querySelector('[data-tabs-content][value="referral"]');
                  if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const elementTop = elementRect.top + window.pageYOffset;
                    const viewportHeight = window.innerHeight;
                    const offsetTop = elementTop - (viewportHeight / 2) + 100;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                  }
                }, 100);
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
