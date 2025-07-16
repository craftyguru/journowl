import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import { useState } from "react";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
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
          
          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              className={`${currentView === "dashboard" ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => onNavigate("dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`${currentView === "insights" ? "text-primary" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => onNavigate("insights")}
            >
              Insights
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
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {user && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    fetch('/api/auth/logout', { method: 'POST' })
                      .then(() => window.location.href = '/');
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
              className={`w-full justify-start text-muted-foreground hover:text-primary`}
              onClick={() => {
                // This will navigate to the journal tab within dashboard
                onNavigate("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              📖 Journal
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-muted-foreground hover:text-primary`}
              onClick={() => {
                // This will navigate to the analytics tab within dashboard  
                onNavigate("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              📊 Analytics
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-muted-foreground hover:text-primary`}
              onClick={() => {
                // This will navigate to the achievements tab within dashboard
                onNavigate("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              🏆 Achievements
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-muted-foreground hover:text-primary`}
              onClick={() => {
                // This will navigate to the goals tab within dashboard
                onNavigate("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              🎯 Goals
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-muted-foreground hover:text-primary`}
              onClick={() => {
                // This will navigate to the thoughts tab within dashboard
                onNavigate("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              🧠 AI Thoughts
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${currentView === "insights" ? "text-primary bg-primary/10" : "text-muted-foreground"} hover:text-primary`}
              onClick={() => {
                onNavigate("insights");
                setMobileMenuOpen(false);
              }}
            >
              📊 Insights
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-muted-foreground hover:text-primary`}
              onClick={() => {
                // This will navigate to the calendar tab within dashboard
                onNavigate("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              📅 Memory Calendar
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-muted-foreground hover:text-primary`}
              onClick={() => {
                // This will navigate to the stories tab within dashboard
                onNavigate("dashboard");
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
            {user && (
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-primary sm:hidden"
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' })
                    .then(() => window.location.href = '/');
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
