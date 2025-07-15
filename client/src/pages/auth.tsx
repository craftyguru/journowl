import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { login, register } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/animated-background";
import LandingHero from "@/components/ui/LandingHero";
import { Sparkles, Heart, Brain, Zap } from "lucide-react";

interface AuthPageProps {
  onAuthenticated: () => void;
}

export default function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [showAuth, setShowAuth] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: () => {
      toast({ title: "Welcome back!", description: "You've been logged in successfully." });
      onAuthenticated();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Login failed", variant: "destructive" });
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, username, password }: { email: string; username: string; password: string }) => 
      register(email, username, password),
    onSuccess: () => {
      toast({ title: "Welcome!", description: "Your account has been created successfully." });
      onAuthenticated();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Registration failed", variant: "destructive" });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.email || !registerData.username || !registerData.password || !registerData.confirmPassword) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    registerMutation.mutate({
      email: registerData.email,
      username: registerData.username,
      password: registerData.password,
    });
  };

  if (!showAuth) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <AnimatedBackground />
        <LandingHero onGetStarted={() => setShowAuth(true)} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      {/* Auth Card Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative mx-auto mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  MoodJournal
                </CardTitle>
                <p className="text-gray-300">Your Personal Wellness Companion</p>
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-400">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>AI-Powered Insights</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Gamified Progress</span>
                </div>
              </motion.div>
            </CardHeader>
            
            <CardContent className="px-6 pb-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
                  >
                    Join Now
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
                    <div>
                      <Label htmlFor="login-email" className="text-gray-300 font-medium">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password" className="text-gray-300 font-medium">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
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
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 transition-colors"
                      onClick={() => window.location.href = '/api/auth/google'}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <div className="text-xs font-bold text-red-500">G</div>
                        </div>
                        <span>Continue with Google</span>
                      </div>
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10 transition-colors"
                        onClick={() => window.location.href = '/api/auth/facebook'}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                            <div className="text-xs font-bold text-white">f</div>
                          </div>
                          <span className="text-sm">Facebook</span>
                        </div>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10 transition-colors"
                        onClick={() => window.location.href = '/api/auth/linkedin'}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-700 rounded flex items-center justify-center">
                            <div className="text-xs font-bold text-white">in</div>
                          </div>
                          <span className="text-sm">LinkedIn</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4 mt-6">
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleRegister} 
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="register-email" className="text-gray-300 font-medium">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-username" className="text-gray-300 font-medium">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        value={registerData.username}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Choose a username"
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-password" className="text-gray-300 font-medium">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Create a password"
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-confirm-password" className="text-gray-300 font-medium">Confirm Password</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm your password"
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating account...
                        </div>
                      ) : (
                        "Create Account & Begin"
                      )}
                    </Button>
                  </motion.form>
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
    </div>
  );
}
