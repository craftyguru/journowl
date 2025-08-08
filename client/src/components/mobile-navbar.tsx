import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Brain, Users, Settings, LogOut, BookOpen, BarChart3, Trophy, Target, Calendar, Lightbulb, Sparkles } from "lucide-react";

interface MobileNavbarProps {
  onNavigate: (view: string) => void;
  currentView?: string;
  activeTab?: string;
  isKidMode?: boolean;
}

export default function MobileNavbar({ onNavigate, currentView = "dashboard", activeTab, isKidMode = false }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "insights", label: "AI Insights", icon: Brain },
    { id: "demo", label: "Demo Mode", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const dashboardTabItems = isKidMode ? [
    { id: "journal", label: "✍️ Write Stories", icon: BookOpen },
    { id: "achievements", label: "🏆 Achievements", icon: Trophy },
    { id: "goals", label: "🎯 Goals", icon: Target },
    { id: "stories", label: "📚 AI Stories", icon: Sparkles },
  ] : [
    { id: "journal", label: "✍️ Journal", icon: BookOpen },
    { id: "analytics", label: "📊 Analytics", icon: BarChart3 },
    { id: "achievements", label: "🏆 Awards", icon: Trophy },
    { id: "goals", label: "🎯 Goals", icon: Target },
    { id: "insights", label: "🧠 AI Therapist", icon: Brain },
    { id: "calendar", label: "📅 Memory Calendar", icon: Calendar },
    { id: "stories", label: "📚 AI Stories", icon: Sparkles },
  ];

  const handleNavigation = (view: string) => {
    onNavigate(view);
    setIsOpen(false);
  };

  const handleTabNavigation = (tab: string) => {
    // Navigate to dashboard if not already there
    if (currentView !== "dashboard") {
      onNavigate("dashboard");
    }
    
    // Navigate to specific tab
    onNavigate(tab);
    
    // Close mobile menu
    setIsOpen(false);
    
    // Add scroll functionality with delay to ensure content is rendered
    setTimeout(() => {
      const tabsContainer = document.querySelector('[role="tabpanel"][data-state="active"]') || 
                           document.querySelector(`[data-tabs-content][value="${tab}"]`);
      
      if (tabsContainer) {
        const rect = tabsContainer.getBoundingClientRect();
        const scrollTop = window.pageYOffset + rect.top - 100;
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
      } else {
        // Fallback: scroll to approximate header height
        const headerHeight = 400;
        window.scrollTo({ top: headerHeight, behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm lg:hidden">
        <div className="mobile-container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🦉 JournOwl
            </h1>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">🦉 JournOwl Menu</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Navigate your journal</p>
                </div>
                
                <nav className="flex-1 p-4">
                  <div className="space-y-4">
                    {/* Main Navigation */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 px-2">Main Navigation</h3>
                      <div className="space-y-2">
                        {mainNavItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = currentView === item.id;
                          
                          return (
                            <Button
                              key={item.id}
                              variant={isActive ? "default" : "ghost"}
                              className="w-full justify-start gap-3 h-12"
                              onClick={() => handleNavigation(item.id)}
                            >
                              <Icon className="h-5 w-5" />
                              {item.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dashboard Tabs - Only show if on dashboard */}
                    {currentView === "dashboard" && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 px-2">Dashboard Sections</h3>
                        <div className="space-y-2">
                          {dashboardTabItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            
                            return (
                              <Button
                                key={item.id}
                                variant={isActive ? "default" : "ghost"}
                                className="w-full justify-start gap-3 h-10 text-sm"
                                onClick={() => handleTabNavigation(item.id)}
                              >
                                <Icon className="h-4 w-4" />
                                {item.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </nav>
                
                <div className="p-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-12 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleNavigation("landing");
                      // Also trigger logout
                      fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                        window.location.href = '/';
                      });
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation (Hidden on mobile) */}
      <div className="hidden lg:block sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="mobile-container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🦉 JournOwl
            </h1>
            
            <nav className="flex items-center gap-4">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className="gap-2"
                    onClick={() => handleNavigation(item.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => {
              handleNavigation("landing");
              fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                window.location.href = '/';
              });
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}