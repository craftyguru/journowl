import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import { AnimatedBackground } from "./AnimatedBackground";

interface EmailVerificationProps {
  verificationEmail: string;
  onResend: () => void;
  onBack: () => void;
  isResending: boolean;
}

export const EmailVerification = ({ 
  verificationEmail, 
  onResend, 
  onBack,
  isResending
}: EmailVerificationProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Check Your Email! 📧
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                We've sent a verification link to:
              </p>
              <p className="font-medium text-gray-900 bg-gray-100 p-3 rounded-lg">
                {verificationEmail}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Click the verification link in your email
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                You'll be automatically signed in
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Start your journaling journey!
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the email? Check your spam folder or:
              </p>
              <Button
                onClick={onResend}
                disabled={isResending}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </div>

            <Button
              onClick={onBack}
              variant="ghost"
              className="w-full"
            >
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
