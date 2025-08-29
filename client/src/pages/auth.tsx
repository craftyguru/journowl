import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Mail, RefreshCw, CheckCircle } from "lucide-react";
import { WelcomeTutorial } from "@/components/welcome-tutorial";
import { LegalDocumentModal } from "@/components/LegalDocumentModal";
import { CaptchaChallenge } from "@/components/CaptchaChallenge";

// Animated background component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Smoke particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
    </div>
  );
};

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
    confirmPassword: "",
    promoCode: ""
  });

  // Security features state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [hasAgreedToPrivacy, setHasAgreedToPrivacy] = useState(false);
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
    
    // Trim all fields
    const trimmedData = {
      email: registerData.email.trim(),
      username: registerData.username.trim(),
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
      promoCode: registerData.promoCode.trim()
    };

    // Check all required fields are filled
    if (!trimmedData.email || !trimmedData.username || !trimmedData.password || !trimmedData.confirmPassword) {
      toast({
        title: "All fields required",
        description: "Please fill in your email, username, password, and confirm password.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate username (minimum 3 characters, alphanumeric + underscore)
    if (trimmedData.username.length < 3) {
      toast({
        title: "Username too short",
        description: "Username must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedData.username)) {
      toast({
        title: "Invalid username",
        description: "Username can only contain letters, numbers, and underscores.",
        variant: "destructive",
      });
      return;
    }
    
    // Password validation
    if (trimmedData.password !== trimmedData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (trimmedData.password.length < 8) {
      toast({
        title: "Password too weak",
        description: "Password must be at least 8 characters long and contain letters and numbers.",
        variant: "destructive",
      });
      return;
    }

    // Check password strength
    const hasLetter = /[a-zA-Z]/.test(trimmedData.password);
    const hasNumber = /\d/.test(trimmedData.password);
    
    if (!hasLetter || !hasNumber) {
      toast({
        title: "Password too weak",
        description: "Password must contain both letters and numbers for security.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has agreed to both documents
    if (!hasAgreedToTerms || !hasAgreedToPrivacy) {
      toast({
        title: "Legal documents required",
        description: "Please read and agree to both Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    // Check if CAPTCHA is completed
    if (!captchaToken) {
      toast({
        title: "Security verification required",
        description: "Please complete the security verification to continue.",
        variant: "destructive",
      });
      return;
    }

    // Submit with trimmed data
    registerMutation.mutate({ ...trimmedData, captchaToken });
  };

  const handleTermsAgree = () => {
    setHasAgreedToTerms(true);
    setShowTermsModal(false);
  };

  const handlePrivacyAgree = () => {
    setHasAgreedToPrivacy(true);
    setShowPrivacyModal(false);
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
                  onClick={() => resendVerificationMutation.mutate(verificationEmail)}
                  disabled={resendVerificationMutation.isPending}
                  variant="outline"
                  className="w-full"
                >
                  {resendVerificationMutation.isPending ? (
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
                onClick={() => setShowEmailVerification(false)}
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
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-3 sm:p-4">
      <AnimatedBackground />
      
      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-black border-white/10 shadow-2xl">
            <CardHeader className="text-center pb-2 px-4 sm:px-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                🦉 JournOwl
              </CardTitle>
              <p className="text-gray-300 mt-2 text-sm sm:text-base">Your Wise Writing Companion</p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
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
                  <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleLogin} 
                    className="space-y-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Label htmlFor="login-identifier" className="text-gray-300 font-medium text-sm sm:text-base">Email or Username</Label>
                      <Input
                        id="login-identifier"
                        type="text"
                        value={loginData.identifier}
                        onChange={(e) => setLoginData(prev => ({ ...prev, identifier: e.target.value }))}
                        placeholder="Enter your email or username"
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:bg-white/10 text-base min-h-[48px] px-4"
                        autoComplete="username"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <Label htmlFor="login-password" className="text-gray-300 font-medium text-sm sm:text-base">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:bg-white/10 text-base min-h-[48px] px-4"
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
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 min-h-[52px] rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-base"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
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

                  {/* Social Login Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 text-gray-400 bg-transparent">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="grid grid-cols-1 gap-3"
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
                        onClick={() => window.location.href = '/api/auth/google'}
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span>Continue with Google</span>
                        </div>
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                        onClick={() => window.location.href = '/api/auth/facebook'}
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          <span>Continue with Facebook</span>
                        </div>
                      </Button>
                    </motion.div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4 mt-6">
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleRegister} 
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
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
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
                        onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
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
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
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
                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm your password"
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:bg-white/10"
                        autoComplete="new-password"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <Label htmlFor="register-promo-code" className="text-gray-300 font-medium">Promo Code (Optional)</Label>
                      <Input
                        id="register-promo-code"
                        type="text"
                        value={registerData.promoCode}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, promoCode: e.target.value.toUpperCase() }))}
                        placeholder="Enter promo code for bonuses"
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 hover:bg-white/10"
                        maxLength={20}
                      />
                    </motion.div>

                    {/* Legal Documents Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="bg-white/5 border border-white/20 rounded-lg p-4 space-y-4"
                    >
                      <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        📋 Read Our Legal Documents
                      </h3>
                      
                      <div className="space-y-3">
                        <Button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className={`w-full ${hasAgreedToTerms ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
                        >
                          📄 {hasAgreedToTerms ? '✅ Terms of Service (Agreed)' : 'Read Terms of Service'}
                        </Button>
                        
                        <Button
                          type="button"
                          onClick={() => setShowPrivacyModal(true)}
                          className={`w-full ${hasAgreedToPrivacy ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white transition-colors`}
                        >
                          🔒 {hasAgreedToPrivacy ? '✅ Privacy Policy (Agreed)' : 'Read Privacy Policy'}
                        </Button>
                      </div>

                      <div className="flex items-start gap-3 pt-2">
                        <input
                          type="checkbox"
                          id="final-agreement"
                          checked={hasAgreedToTerms && hasAgreedToPrivacy}
                          readOnly
                          disabled={!hasAgreedToTerms || !hasAgreedToPrivacy}
                          className="mt-1 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-2 disabled:opacity-50"
                        />
                        <label htmlFor="final-agreement" className="text-sm text-gray-300 leading-relaxed">
                          {hasAgreedToTerms && hasAgreedToPrivacy ? 
                            '✅ I have read and agree to both documents' : 
                            '📋 Please read both documents above to proceed'}
                        </label>
                      </div>
                    </motion.div>

                    {/* CAPTCHA Section */}
                    {hasAgreedToTerms && hasAgreedToPrivacy && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/5 border border-white/20 rounded-lg p-4"
                      >
                        <CaptchaChallenge
                          onSuccess={handleCaptchaSuccess}
                          onError={() => setCaptchaToken("")}
                        />
                      </motion.div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-600 disabled:transform-none disabled:shadow-none"
                      disabled={registerMutation.isPending || !hasAgreedToTerms || !hasAgreedToPrivacy || !captchaToken}
                    >
                      {registerMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating account...
                        </div>
                      ) : !hasAgreedToTerms || !hasAgreedToPrivacy ? (
                        "Read Legal Documents First"
                      ) : !captchaToken ? (
                        "Complete Security Check"
                      ) : (
                        "Create Account & Begin"
                      )}
                    </Button>

                    {/* Security indicators */}
                    {hasAgreedToTerms && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Terms of Service accepted
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
                  </motion.form>

                  {/* Social Login Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 text-gray-400 bg-transparent">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="grid grid-cols-1 gap-3"
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
                        onClick={() => window.location.href = '/api/auth/google'}
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span>Continue with Google</span>
                        </div>
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                        onClick={() => window.location.href = '/api/auth/facebook'}
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          <span>Continue with Facebook</span>
                        </div>
                      </Button>
                    </motion.div>
                  </motion.div>
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

      {/* Legal Document Modals */}
      <LegalDocumentModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={handleTermsAgree}
        documentType="terms"
      />
      
      <LegalDocumentModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onAgree={handlePrivacyAgree}
        documentType="privacy"
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