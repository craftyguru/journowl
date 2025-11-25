import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  loginData: { identifier: string; password: string };
  setLoginData: (data: { identifier: string; password: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const LoginForm = ({ loginData, setLoginData, onSubmit, isLoading }: LoginFormProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.identifier || !loginData.password) {
      toast({
        title: "Missing information",
        description: "Please enter both email/username and password.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(e);
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit} 
      className="space-y-4"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Label htmlFor="login-identifier" className="text-gray-300 font-medium">Email or Username</Label>
        <Input
          id="login-identifier"
          type="text"
          value={loginData.identifier}
          onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
          placeholder="Enter your email or username"
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:bg-white/10"
          autoComplete="username"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Label htmlFor="login-password" className="text-gray-300 font-medium">Password</Label>
        <Input
          id="login-password"
          type="password"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          placeholder="Enter your password"
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:bg-white/10"
          autoComplete="current-password"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Signing in...
            </div>
          ) : (
            "Sign In & Start Journaling"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
};
