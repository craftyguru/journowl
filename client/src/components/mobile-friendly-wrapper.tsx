import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MobileFriendlyWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function MobileFriendlyWrapper({ children, className = "" }: MobileFriendlyWrapperProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen mobile-safe-area p-2 sm:p-4 lg:p-6 ${className}`}
    >
      <div className="mobile-container">
        {children}
      </div>
    </motion.div>
  );
}