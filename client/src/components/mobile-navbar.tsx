import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Brain, Users, Settings, LogOut } from "lucide-react";

interface MobileNavbarProps {
  onNavigate: (view: string) => void;
  currentView?: string;
}

export default function MobileNavbar({ onNavigate, currentView = "dashboard" }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "insights", label: "AI Insights", icon: Brain },
    { id: "demo", label: "Demo Mode", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavigation = (view: string) => {
    onNavigate(view);
    setIsOpen(false);
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
                  <div className="space-y-2">
                    {navItems.map((item) => {
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
              {navItems.map((item) => {
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