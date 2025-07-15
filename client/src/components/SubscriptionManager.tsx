import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Crown, Zap, Cloud, Star, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SubscriptionData {
  tier: string;
  status: string;
  expiresAt?: string;
  promptsRemaining: number;
  storageUsed: number;
  storageLimit: number;
}

const subscriptionTiers = [
  {
    id: 'free',
    name: 'Free Explorer',
    price: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: '🌱',
    color: 'from-green-500 to-emerald-500',
    features: [
      '100 AI prompts/month',
      '100MB storage',
      'Basic journal features',
      'Mobile access'
    ],
    limits: {
      prompts: 100,
      storage: 100
    }
  },
  {
    id: 'premium',
    name: 'Wise Writer',
    price: 9.99,
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    icon: '✨',
    color: 'from-purple-500 to-pink-500',
    popular: true,
    features: [
      '1,000 AI prompts/month',
      '1GB storage',
      'Advanced analytics',
      'Photo AI analysis',
      'Priority support',
      'Export features'
    ],
    limits: {
      prompts: 1000,
      storage: 1024
    }
  },
  {
    id: 'pro',
    name: 'Journal Master',
    price: 19.99,
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    icon: '🦉',
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Unlimited AI prompts',
      '10GB storage',
      'Team sharing',
      'Custom templates',
      'API access',
      'White-label options',
      '24/7 support'
    ],
    limits: {
      prompts: -1, // unlimited
      storage: 10240
    }
  }
];

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm = ({ clientSecret, onSuccess, onError }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      onError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Complete Subscription
          </div>
        )}
      </Button>
    </form>
  );
};

export default function SubscriptionManager() {
  const [showTierModal, setShowTierModal] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current subscription data
  const { data: subscription, isLoading } = useQuery<SubscriptionData>({
    queryKey: ["/api/subscription"],
  });

  const subscriptionMutation = useMutation({
    mutationFn: async ({ tierId, yearly }: { tierId: string; yearly: boolean }) => {
      const tier = subscriptionTiers.find(t => t.id === tierId);
      if (!tier) throw new Error('Invalid tier');
      
      const amount = yearly ? Math.round(tier.yearlyPrice * 90) : Math.round(tier.monthlyPrice * 100); // 10% yearly discount
      
      const response = await apiRequest("POST", "/api/subscription/create", {
        tierId,
        yearly,
        amount
      });
      return response;
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setShowCheckout(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to initiate subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const confirmSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/subscription/confirm", {
        clientSecret
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Activated! 🎉",
        description: data.message,
      });
      setShowCheckout(false);
      setShowTierModal(false);
      setClientSecret("");
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to confirm subscription. Please contact support.",
        variant: "destructive",
      });
    },
  });

  const handleTierSelect = (tierId: string) => {
    if (tierId === 'free') {
      toast({
        title: "Already on Free Plan",
        description: "You're currently on the free plan. Choose a premium tier to upgrade!",
      });
      return;
    }
    
    setSelectedTier(tierId);
    subscriptionMutation.mutate({ tierId, yearly: isYearly });
  };

  const handlePaymentSuccess = () => {
    confirmSubscriptionMutation.mutate();
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentTier = subscriptionTiers.find(t => t.id === subscription?.tier) || subscriptionTiers[0];
  const promptUsagePercentage = subscription ? Math.min(100, ((subscription.promptsRemaining / currentTier.limits.prompts) * 100)) : 0;
  const storageUsagePercentage = subscription ? Math.min(100, ((subscription.storageUsed / subscription.storageLimit) * 100)) : 0;

  return (
    <>
      {/* Usage Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Prompts Usage Meter */}
        <Card className="border-2 border-gradient-to-r from-purple-200 to-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Prompts Usage
              <Badge variant={subscription?.tier === 'free' ? "secondary" : "default"}>
                {currentTier.name}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Prompts Remaining</span>
                <span className={`font-bold ${promptUsagePercentage < 20 ? 'text-red-600' : 'text-green-600'}`}>
                  {subscription?.promptsRemaining || 0} / {currentTier.limits.prompts === -1 ? '∞' : currentTier.limits.prompts}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    promptUsagePercentage < 20 ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  style={{ width: `${100 - promptUsagePercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                Resets monthly • {100 - promptUsagePercentage}% remaining
              </div>
            </div>

            <Button 
              onClick={() => setShowTierModal(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Top Off Prompts
            </Button>
          </CardContent>
        </Card>

        {/* Storage Usage Meter */}
        <Card className="border-2 border-gradient-to-r from-blue-200 to-cyan-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              Storage Usage
              <Badge variant={subscription?.tier === 'free' ? "secondary" : "default"}>
                {currentTier.name}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span className={`font-bold ${storageUsagePercentage > 80 ? 'text-red-600' : 'text-green-600'}`}>
                  {subscription?.storageUsed || 0} MB / {subscription?.storageLimit || 100} MB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    storageUsagePercentage > 80 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}
                  style={{ width: `${storageUsagePercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                Photos & attachments • {(100 - storageUsagePercentage).toFixed(1)}% available
              </div>
            </div>

            <Button 
              onClick={() => setShowTierModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Subscription
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Tier Modal */}
      <Dialog open={showTierModal} onOpenChange={setShowTierModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Crown className="w-6 h-6 text-purple-600" />
              Choose Your JournOwl Plan
            </DialogTitle>
          </DialogHeader>

          {!showCheckout ? (
            <div className="space-y-6">
              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <span className={`font-medium ${!isYearly ? 'text-purple-700' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <Switch 
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                  className="data-[state=checked]:bg-purple-500"
                />
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isYearly ? 'text-purple-700' : 'text-gray-500'}`}>
                    Yearly
                  </span>
                  <Badge className="bg-green-500 text-white">Save 10%</Badge>
                </div>
              </div>

              {/* Tier Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionTiers.map((tier, index) => (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-2xl border-2 p-6 ${
                      tier.popular 
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl scale-105' 
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg'
                    } transition-all duration-300`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className="text-center space-y-4">
                      <div className="text-4xl">{tier.icon}</div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{tier.name}</h3>
                        <div className="mt-2">
                          {tier.id === 'free' ? (
                            <div className="text-3xl font-bold text-gray-700">Free</div>
                          ) : (
                            <div className="space-y-1">
                              <div className="text-3xl font-bold text-gray-700">
                                ${isYearly ? (tier.yearlyPrice / 12).toFixed(2) : tier.monthlyPrice}
                                <span className="text-base text-gray-500">/month</span>
                              </div>
                              {isYearly && (
                                <div className="text-sm text-green-600 font-medium">
                                  Billed ${tier.yearlyPrice}/year (Save 10%)
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {tier.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        onClick={() => handleTierSelect(tier.id)}
                        disabled={subscriptionMutation.isPending || subscription?.tier === tier.id}
                        className={`w-full ${
                          tier.popular 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {subscriptionMutation.isPending && selectedTier === tier.id ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Processing...
                          </div>
                        ) : subscription?.tier === tier.id ? (
                          'Current Plan'
                        ) : tier.id === 'free' ? (
                          'Free Forever'
                        ) : (
                          `Upgrade to ${tier.name}`
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Complete Your Subscription
                </h3>
                <p className="text-gray-600">
                  Upgrading to {subscriptionTiers.find(t => t.id === selectedTier)?.name}
                </p>
              </div>
              
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
              
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCheckout(false)}
                  className="text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}