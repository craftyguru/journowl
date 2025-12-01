import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SignupFormProps {
  registerData: { email: string; username: string; password: string; confirmPassword: string };
  setRegisterData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  hasAgreedToTerms: boolean;
  captchaToken: string;
}

export const SignupForm = ({ 
  registerData, 
  setRegisterData, 
  onSubmit, 
  isLoading,
  hasAgreedToTerms,
  captchaToken
}: SignupFormProps) => {
  const { toast } = useToast();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"terms" | "privacy" | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.email || !registerData.username || !registerData.password || !registerData.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (registerData.password.length < 8) {
      toast({
        title: "Password too weak",
        description: "Password must be at least 8 characters long and contain letters and numbers.",
        variant: "destructive",
      });
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(registerData.password);
    const hasNumber = /\d/.test(registerData.password);
    
    if (!hasLetter || !hasNumber) {
      toast({
        title: "Password too weak",
        description: "Password must contain both letters and numbers for security.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(e);
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
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
        <Label htmlFor="register-email" className="text-gray-300 font-medium">Email</Label>
        <Input
          id="register-email"
          type="email"
          value={registerData.email}
          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
          placeholder="Enter your email"
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:bg-white/10"
          autoComplete="email"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Label htmlFor="register-username" className="text-gray-300 font-medium">Username</Label>
        <Input
          id="register-username"
          type="text"
          value={registerData.username}
          onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
          placeholder="Choose a username"
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:bg-white/10"
          autoComplete="username"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Label htmlFor="register-password" className="text-gray-300 font-medium">Password</Label>
        <Input
          id="register-password"
          type="password"
          value={registerData.password}
          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          placeholder="Create a password"
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:bg-white/10"
          autoComplete="new-password"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Label htmlFor="register-confirm-password" className="text-gray-300 font-medium">Confirm Password</Label>
        <Input
          id="register-confirm-password"
          type="password"
          value={registerData.confirmPassword}
          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
          placeholder="Confirm your password"
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:bg-white/10"
          autoComplete="new-password"
        />
      </motion.div>
      {/* Terms and Privacy Policy Checkboxes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="space-y-3 bg-white/5 p-3 rounded-lg border border-white/10"
      >
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="terms" className="text-sm text-gray-300 font-normal">
            I accept the{" "}
            <button
              type="button"
              onClick={() => {
                setModalType("terms");
                setShowModal(true);
              }}
              className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 cursor-pointer hover:underline"
            >
              Terms of Service
              <ExternalLink className="w-3 h-3" />
            </button>
          </Label>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="privacy"
            checked={agreedToPrivacy}
            onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="privacy" className="text-sm text-gray-300 font-normal">
            I have read and agree to the{" "}
            <button
              type="button"
              onClick={() => {
                setModalType("privacy");
                setShowModal(true);
              }}
              className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 cursor-pointer hover:underline"
            >
              Privacy Policy
              <ExternalLink className="w-3 h-3" />
            </button>
          </Label>
        </div>
      </motion.div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || !agreedToTerms || !agreedToPrivacy}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Creating account...
          </div>
        ) : (
          "Create Account & Begin"
        )}
      </Button>

      {/* Security indicators */}
      {agreedToTerms && agreedToPrivacy && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          All agreements accepted
        </div>
      )}
      {captchaToken && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          Security verification complete
        </div>
      )}
      
      <p className="text-xs text-gray-400 text-center mt-2">
        Password must be at least 8 characters with letters and numbers
      </p>

      {/* Modal with Iframe */}
      {showModal && modalType && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-lg w-full max-w-3xl h-[80vh] flex flex-col border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">
                {modalType === "terms" ? "Terms of Service" : "Privacy Policy"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Iframe */}
            <iframe
              src={modalType === "terms" ? "/terms" : "/privacy-policy"}
              className="flex-1 border-none bg-gray-800"
            />

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.form>
  );
};
