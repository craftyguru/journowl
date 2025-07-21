import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { StarryBackground } from "@/components/starry-background";
import { CheckCircle, XCircle, Mail, Home, ArrowRight } from "lucide-react";

export default function EmailVerified() {
  const [location] = useLocation();
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    const verifiedParam = urlParams.get('verified');
    
    console.log('EmailVerified page - URL params:', window.location.search, 'success:', successParam, 'verified:', verifiedParam);
    
    // Check if verification was successful
    if (successParam === '1' || verifiedParam === 'true') {
      setSuccess(true);
    } else if (successParam === '0') {
      setSuccess(false);
    } else {
      setSuccess(false);
    }
    
    setLoading(false);
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <StarryBackground />
        <div className="text-white text-xl">Verifying your email...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <StarryBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full mx-4"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 shadow-2xl">
          {success ? (
            <>
              {/* Success State */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={40} className="text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-4"
              >
                🦉 Email Verified!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 mb-6 leading-relaxed"
              >
                Welcome to JournOwl! Your email has been successfully verified and you're now logged in. 
                Ready to start your journaling adventure?
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <button
                  onClick={() => window.location.href = "/"}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Home size={20} />
                  Start Journaling
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-white/60 text-sm">
                  🌟 Your journaling adventure awaits! 🌟
                </div>
              </motion.div>
            </>
          ) : (
            <>
              {/* Error State */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-red-500 rounded-full flex items-center justify-center mb-4">
                  <XCircle size={40} className="text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-4"
              >
                Verification Failed
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 mb-6 leading-relaxed"
              >
                We couldn't verify your email. The verification link may have expired or been used already.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <button
                  onClick={() => window.location.href = "/auth"}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Mail size={20} />
                  Request New Verification
                </button>

                <button
                  onClick={() => window.location.href = "/"}
                  className="w-full bg-white/10 text-white py-3 px-6 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  Back to Home
                </button>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}