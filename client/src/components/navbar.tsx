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
  isKidMode?: boolean;
  onModeSwitch?: (isKidMode: boolean) => void;
}

export default function Navbar({ currentView, activeTab, onNavigate, isKidMode = false, onModeSwitch }: NavbarProps) {
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
          
          {/* Desktop Tab Navigation - Mode-Specific */}
          <div className="hidden md:flex items-center space-x-0">
            {!isKidMode ? (
              // Adult Mode Tabs
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "journal" ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => {
                    onNavigate("journal");
                    setTimeout(() => {
                      const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                           document.querySelector('[data-tabs-content][value="journal"]');
                      
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
              </>
            ) : (
              // Kid Mode Tabs
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "write" ? "bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => onNavigate("write")}
                >
                  ✍️ Write
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "achievements" ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => onNavigate("achievements")}
                >
                  🏆 Badges
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "goals" ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => onNavigate("goals")}
                >
                  🎯 Goals
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "calendar" ? "bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => onNavigate("calendar")}
                >
                  📅 Calendar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "photos" ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => onNavigate("photos")}
                >
                  📸 Photos
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "ai" ? "bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => onNavigate("ai")}
                >
                  🤖 AI Help
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "stats" ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => onNavigate("stats")}
                >
                  📊 My Stats
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`px-1.5 py-1 text-xs font-medium transition-all duration-200 ${activeTab === "story" ? "bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-md" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  onClick={() => onNavigate("story")}
                >
                  📚 AI Story
                </Button>
              </>
            )}
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
                {/* Mode Switcher Buttons */}
                <div className="hidden md:flex items-center gap-1 bg-muted/30 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-3 py-1.5 text-xs font-medium transition-all ${!isKidMode ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                    title={!isKidMode ? "Adult Mode (Current)" : "Switch to Adult Mode"}
                    onClick={() => onModeSwitch?.(false)}
                  >
                    👨‍💼 Adult
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-3 py-1.5 text-xs font-medium transition-all ${isKidMode ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                    title={isKidMode ? "Kid Mode (Current)" : "Switch to Kid Mode"}
                    onClick={() => onModeSwitch?.(true)}
                  >
                    🧒 Kid
                  </Button>
                </div>
                
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
                  className="hidden sm:inline-flex text-sm border-red-500 text-red-600 dark:text-red-400 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-shadow"
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
          <div className="px-4 py-2 space-y-1">
            {!isKidMode ? (
              // Adult Mode Mobile Menu
              <>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "journal" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("journal");
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                           document.querySelector('[data-tabs-content][value="journal"]');
                      
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
                  ✍️ Journal
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "analytics" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("analytics");
                    setMobileMenuOpen(false);
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
                  className={`w-full justify-start ${activeTab === "achievements" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("achievements");
                    setMobileMenuOpen(false);
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
                  className={`w-full justify-start ${activeTab === "goals" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("goals");
                    setMobileMenuOpen(false);
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
                  className={`w-full justify-start ${activeTab === "insights" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("insights");
                    setMobileMenuOpen(false);
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
                  className={`w-full justify-start ${activeTab === "calendar" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("calendar");
                    setMobileMenuOpen(false);
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
                  className={`w-full justify-start ${activeTab === "stories" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("stories");
                    setMobileMenuOpen(false);
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
                  className={`w-full justify-start ${activeTab === "referral" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("referral");
                    setMobileMenuOpen(false);
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
              </>
            ) : (
              // Kid Mode Mobile Menu
              <>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "write" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("write");
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                           document.querySelector('[data-tabs-content][value="write"]');
                      
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
                  ✍️ Write
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "achievements" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("achievements");
                    setMobileMenuOpen(false);
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
                  🏆 Badges
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "goals" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("goals");
                    setMobileMenuOpen(false);
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
                  className={`w-full justify-start ${activeTab === "calendar" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("calendar");
                    setMobileMenuOpen(false);
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
                  📅 Calendar
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "photos" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("photos");
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                           document.querySelector('[data-tabs-content][value="photos"]');
                      
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
                  📸 Photos
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "ai" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("ai");
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                           document.querySelector('[data-tabs-content][value="ai"]');
                      
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
                  🤖 AI Help
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "stats" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("stats");
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                           document.querySelector('[data-tabs-content][value="stats"]');
                      
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
                  📊 My Stats
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "story" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
                  onClick={() => {
                    onNavigate("story");
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                                           document.querySelector('[data-tabs-content][value="story"]');
                      
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
                  📚 AI Story
                </Button>
              </>
            )}
            
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
