import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-label={title}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="text-6xl mb-6"
      >
        {icon}
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mb-8">{description}</p>

      <div className="flex gap-3 flex-wrap justify-center">
        {actionLabel && onAction && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onAction}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              data-testid="button-empty-state-action"
              aria-label={actionLabel}
            >
              {actionLabel}
            </Button>
          </motion.div>
        )}
        {secondaryLabel && onSecondaryAction && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onSecondaryAction}
              variant="outline"
              className="px-6 py-2 rounded-lg transition-colors"
              data-testid="button-empty-state-secondary"
              aria-label={secondaryLabel}
            >
              {secondaryLabel}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
