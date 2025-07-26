import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn, UserPlus, FileText, Shield, Palette } from "lucide-react";
import { ThemeSelector } from "@/components/theme-selector";
import { useTheme } from "@/components/theme-provider";

interface LandingHeaderProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function LandingHeader({ onSignIn, onSignUp }: LandingHeaderProps) {
  const { colorScheme, toggleColorScheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-black/10 backdrop-blur-lg border-b border-white/20 dark:border-gray-800/20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Brand */}
          <motion.div
            className="flex items-center gap-3"
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
              <p className="text-xs text-gray-300 dark:text-gray-400 hidden sm:block">
                Your Wise Writing Companion
              </p>
            </div>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="/privacy-policy" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <Shield className="w-4 h-4" />
              Privacy
            </a>
            <a 
              href="/terms" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <FileText className="w-4 h-4" />
              Terms
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Controls */}
            <div className="hidden sm:flex items-center gap-2">
              <ThemeSelector />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleColorScheme}
                className="rounded-lg w-8 h-8 sm:w-10 sm:h-10"
                title="Toggle Dark/Light Mode"
              >
                {colorScheme === "dark" ? "☀️" : "🌙"}
              </Button>
            </div>

            {/* Authentication Buttons */}
            <Button
              variant="ghost"
              onClick={onSignIn}
              className="text-white hover:bg-white/10 text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 transition-all"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign In</span>
              <span className="sm:hidden">In</span>
            </Button>
            
            <Button
              onClick={onSignUp}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm sm:text-base px-3 sm:px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all border-0"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Up</span>
              <span className="sm:hidden">Up</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 border-t border-white/10 mt-3 pt-3 flex items-center justify-center gap-4">
          <a 
            href="/privacy-policy" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-xs"
          >
            <Shield className="w-3 h-3" />
            Privacy
          </a>
          <a 
            href="/terms" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-xs"
          >
            <FileText className="w-3 h-3" />
            Terms
          </a>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleColorScheme}
              className="rounded-lg w-6 h-6"
              title="Toggle Dark/Light Mode"
            >
              {colorScheme === "dark" ? "☀️" : "🌙"}
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}