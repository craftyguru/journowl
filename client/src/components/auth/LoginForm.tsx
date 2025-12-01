import { useState } from "react";
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
  onForgotPassword?: (email: string) => void;
  onResendVerification?: (email: string) => void;
}

export const LoginForm = ({ loginData, setLoginData, onSubmit, isLoading, onForgotPassword, onResendVerification }: LoginFormProps) => {
  const { toast } = useToast();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resendEmail, setResendEmail] = useState("");

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

      {/* Forgot Password & Resend Verification Links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex gap-2 justify-center text-sm"
      >
        <button
          type="button"
          onClick={() => setShowForgotModal(true)}
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Forgot Password?
        </button>
        <span className="text-gray-500">•</span>
        <button
          type="button"
          onClick={() => setShowResendModal(true)}
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Resend Verification
        </button>
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForgotModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-lg p-6 w-full max-w-sm border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Reset Password</h3>
            <p className="text-gray-300 text-sm mb-4">Enter your email and we'll send you a link to reset your password.</p>
            <Input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => setShowForgotModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (forgotEmail) {
                    onForgotPassword?.(forgotEmail);
                    setShowForgotModal(false);
                    setForgotEmail("");
                  } else {
                    toast({
                      title: "Please enter your email",
                      variant: "destructive",
                    });
                  }
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Send Reset Link
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Resend Verification Modal */}
      {showResendModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowResendModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-lg p-6 w-full max-w-sm border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Resend Verification Email</h3>
            <p className="text-gray-300 text-sm mb-4">Enter your email and we'll send you a new verification link.</p>
            <Input
              type="email"
              placeholder="Enter your email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => setShowResendModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (resendEmail) {
                    onResendVerification?.(resendEmail);
                    setShowResendModal(false);
                    setResendEmail("");
                  } else {
                    toast({
                      title: "Please enter your email",
                      variant: "destructive",
                    });
                  }
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Resend Email
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.form>
  );
};
