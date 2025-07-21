import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mail, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface EmailConfirmationProps {
  email?: string;
  username?: string;
}

export const EmailConfirmation = ({ email, username }: EmailConfirmationProps) => {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!email || isResending) return;
    
    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        setResendSuccess(true);
        setCountdown(60);
        setCanResend(false);
        setTimeout(() => setResendSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to resend email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full text-center relative z-10"
      >
        
        {/* Success Icon with Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2 
          }}
          className="relative mb-6"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center relative">
            <CheckCircle className="w-10 h-10 text-white" />
            
            {/* Sparkle effects around the icon */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  left: `${50 + 40 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                  top: `${50 + 40 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                variants={sparkleVariants}
                animate="animate"
              />
            ))}
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-white mb-2"
        >
          🦉 Account Created!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-purple-200 mb-6 text-lg"
        >
          Welcome to JournOwl, {username || 'new user'}!
        </motion.p>

        {/* Email Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-blue-500 p-3 rounded-full mr-3"
            >
              <Mail className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-white">Check Your Email!</h3>
              <p className="text-sm text-purple-200">We sent a verification link to:</p>
            </div>
          </div>
          
          <div className="bg-white/10 border border-white/20 rounded-lg p-3 mb-4">
            <p className="text-white font-medium break-all">{email}</p>
          </div>

          <div className="flex items-center text-sm text-purple-200 mb-4">
            <Clock className="w-4 h-4 mr-2" />
            Click the verification link within 24 hours
          </div>
          
          <p className="text-sm text-purple-100">
            Don't see the email? Check your spam folder or resend below.
          </p>
        </motion.div>

        {/* Resend Email Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          {resendSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mb-4"
            >
              <p className="text-green-200 text-sm">✅ Verification email sent successfully!</p>
            </motion.div>
          )}
          
          <Button
            onClick={handleResendEmail}
            disabled={!canResend || isResending}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transition-all duration-300 ${
              !canResend ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : canResend ? (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Resend Verification Email
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Resend in {countdown}s
              </>
            )}
          </Button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3"
        >
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10 backdrop-blur"
          >
            Back to Home
          </Button>
          
          <Button
            onClick={() => setLocation("/auth?tab=signin")}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
          >
            Sign In
          </Button>
        </motion.div>

        {/* Fun Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-purple-300 mt-6"
        >
          🌟 Your journaling adventure awaits! 🌟
        </motion.p>
      </motion.div>
    </div>
  );
};