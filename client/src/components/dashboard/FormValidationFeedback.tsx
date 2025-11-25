import { AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FormValidationFeedbackProps {
  message?: string;
  type: "error" | "success" | "warning" | "info";
  show: boolean;
}

export function FormValidationFeedback({
  message,
  type,
  show,
}: FormValidationFeedbackProps) {
  if (!show || !message) return null;

  const colors = {
    error: "bg-red-50 border-red-200 text-red-900",
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
  };

  const icons = {
    error: <AlertCircle className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />,
    warning: <AlertCircle className="w-4 h-4" />,
    info: <AlertCircle className="w-4 h-4" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-2 p-3 rounded-lg border-2 ${colors[type]}`}
      role="alert"
      aria-live="polite"
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
}
