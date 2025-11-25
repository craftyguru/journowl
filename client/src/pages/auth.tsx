import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { WelcomeTutorial } from "@/components/welcome-tutorial";
import { UserAgreement } from "@/components/UserAgreement";
import { CaptchaChallenge } from "@/components/CaptchaChallenge";
import { AnimatedBackground } from "@/components/auth/AnimatedBackground";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { EmailVerification } from "@/components/auth/EmailVerification";

interface AuthPageProps {
  setShowAuth: (show: boolean) => void;
  onRegistrationSuccess?: (email: string, username: string) => void;
  onAuthenticated?: () => void;
}

export default function AuthPage({ setShowAuth, onRegistrationSuccess, onAuthenticated }: AuthPageProps) {
  const { toast } = useToast();
  const [showWelcomeTutorial, setShowWelcomeTutorial] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  
  // Determine initial tab based on URL
  const getInitialTab = () => {
    const path = window.location.pathname;
    if (path === '/register' || path === '/signup') return 'register';
    return 'login'; // Default to login for /login, /signin, /auth
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Check for verification success and welcome tutorial trigger
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get('verified');
    const welcome = urlParams.get('welcome');
    const error = urlParams.get('error');
    const message = urlParams.get('message');
    
    if (verified === 'true' && welcome === 'true') {
      // Show welcome tutorial for newly verified users
      setShowWelcomeTutorial(true);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (error) {
      let errorMessage = message || "Authentication failed";
      
      if (error === 'google_not_configured') {
        errorMessage = "Google sign-in is temporarily unavailable. Please use email login or try again later.";
      } else if (error === 'facebook_not_configured') {
        errorMessage = "Facebook sign-in is temporarily unavailable. Please use email login or try again later.";
      } else if (error === 'google_failed') {
        errorMessage = "Google sign-in failed. Please try again or use email login.";
      } else if (error === 'facebook_failed') {
        errorMessage = "Facebook sign-in failed. Please try again or use email login.";
      }
      
      toast({
        title: "Sign-in Issue",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);
  
  const [loginData, setLoginData] = useState({
    identifier: "", // Changed from email to identifier to support both email and username
    password: ""
  });
  
  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  // Security features state
  const [showUserAgreement, setShowUserAgreement] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: typeof loginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
      // Call authentication callback instead of forcing page reload
      if (onAuthenticated) {
        console.log('✅ Login successful, calling onAuthenticated callback');
        // Add a small delay to ensure session is saved on server
        setTimeout(() => {
          onAuthenticated();
        }, 250);
      } else {
        console.log('⚠️ onAuthenticated callback not provided, falling back to page redirect');
        // Fallback to page redirect if callback not provided
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      }
    },
    onError: (error: any) => {
      if (error.message?.includes("verify your email")) {
        setVerificationEmail(loginData.identifier);
        setShowEmailVerification(true);
      }
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof registerData & { captchaToken: string }) => {
      const { confirmPassword, ...submitData } = data;
      const response = await apiRequest("POST", "/api/auth/register", submitData);
      return await response.json();
    },
    onSuccess: (data: any) => {
      console.log('Registration success data:', data);
      console.log('onRegistrationSuccess callback exists:', !!onRegistrationSuccess);
      console.log('data.emailSent:', data.emailSent);
      console.log('data.email:', data.email);
      console.log('registerData.username:', registerData.username);
      
      if (data && data.emailSent && onRegistrationSuccess) {
        // Call the callback to redirect to email confirmation page
        console.log('Calling onRegistrationSuccess with:', data.email, registerData.username);
        onRegistrationSuccess(data.email, registerData.username);
        return;
      } else if (data && data.emailSent) {
        setVerificationEmail(data.email);
        setShowEmailVerification(true);
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account before signing in.",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to JournOwl! Your account has been successfully created.",
        });
        // Scroll to top before redirect
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again with different details.",
        variant: "destructive",
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/auth/resend-verification", { email });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Verification email sent!",
        description: "Please check your inbox for the verification link.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to resend email",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.identifier || !loginData.password) {
      toast({
        title: "Missing information",
        description: "Please enter both email/username and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has agreed to terms
    if (!hasAgreedToTerms) {
      setShowUserAgreement(true);
      return;
    }

    // Check if CAPTCHA is completed
    if (!captchaToken) {
      setShowCaptcha(true);
      toast({
        title: "Security verification required",
        description: "Please complete the security verification to continue.",
        variant: "destructive",
      });
      return;
    }
    
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
    
    // Enhanced password validation
    if (registerData.password.length < 8) {
      toast({
        title: "Password too weak",
        description: "Password must be at least 8 characters long and contain letters and numbers.",
        variant: "destructive",
      });
      return;
    }

    // Check password strength
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

    registerMutation.mutate({ ...registerData, captchaToken });
  };

  const handleUserAgreementAccept = () => {
    setHasAgreedToTerms(true);
    setShowUserAgreement(false);
    setShowCaptcha(true);
  };

  const handleCaptchaSuccess = (token: string) => {
    setCaptchaToken(token);
    setShowCaptcha(false);
    toast({
      title: "Security verification complete",
      description: "You can now create your account.",
    });
  };

  // Welcome Tutorial Component
  if (showWelcomeTutorial) {
    return (
      <WelcomeTutorial
        onComplete={() => {
          setShowWelcomeTutorial(false);
          setShowAuth(false);
        }}
        userEmail={newUserEmail}
      />
    );
  }

  // Email Verification Component
  if (showEmailVerification) {
    return (
      <EmailVerification
        verificationEmail={verificationEmail}
        onResend={() => resendVerificationMutation.mutate(verificationEmail)}
        onBack={() => setShowEmailVerification(false)}
        isResending={resendVerificationMutation.isPending}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-black border-white/10 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                🦉 JournOwl
              </CardTitle>
              <p className="text-gray-300 mt-2">Your Wise Writing Companion</p>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
                  <TabsTrigger value="login" className="text-gray-300 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-gray-300 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 mt-6">
                  <LoginForm
                    loginData={loginData}
                    setLoginData={setLoginData}
                    onSubmit={handleLogin}
                    isLoading={loginMutation.isPending}
                  />
                  <OAuthButtons />
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4 mt-6">
                  <SignupForm
                    registerData={registerData}
                    setRegisterData={setRegisterData}
                    onSubmit={handleRegister}
                    isLoading={registerMutation.isPending}
                    hasAgreedToTerms={hasAgreedToTerms}
                    captchaToken={captchaToken}
                  />
                  <OAuthButtons />
                </TabsContent>
              </Tabs>
              
              {/* Back to Landing Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-center"
              >
                <Button
                  variant="ghost"
                  onClick={() => setShowAuth(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to Homepage
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* User Agreement Modal */}
      <UserAgreement
        isOpen={showUserAgreement}
        onAccept={handleUserAgreementAccept}
        onDecline={() => setShowUserAgreement(false)}
      />

      {/* CAPTCHA Modal */}
      {showCaptcha && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Security Verification</h3>
                <Button
                  onClick={() => setShowCaptcha(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500"
                >
                  ×
                </Button>
              </div>
              
              <CaptchaChallenge 
                onSuccess={handleCaptchaSuccess}
                onError={() => {
                  toast({
                    title: "Verification failed",
                    description: "Please try again with the correct answer.",
                    variant: "destructive",
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}