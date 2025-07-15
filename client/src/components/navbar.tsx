import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  
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
              <span className="text-2xl">📝</span>
            </div>
            <h1 className="text-xl font-bold text-primary">MoodJournal</h1>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {user && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="gradient-bg text-white font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
