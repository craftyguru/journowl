import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PromptUsage {
  promptsRemaining: number;
  promptsUsedThisMonth: number;
  currentPlan: string;
}

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
            <Zap className="w-4 h-4" />
            Complete Purchase - $2.99
          </div>
        )}
      </Button>
    </form>
  );
};

export default function PromptPurchase() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current prompt usage
  const { data: usage, isLoading } = useQuery<PromptUsage>({
    queryKey: ["/api/prompts/usage"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/prompts/purchase", {
        amount: 299,
        promptsToAdd: 100
      });
      return response;
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setShowCheckout(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to initiate purchase. Please try again.",
        variant: "destructive",
      });
    },
  });

  const confirmPurchaseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/prompts/confirm-purchase", {
        paymentIntentId
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Purchase Successful! 🎉",
        description: data.message,
      });
      setShowCheckout(false);
      setClientSecret("");
      queryClient.invalidateQueries({ queryKey: ["/api/prompts/usage"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to confirm purchase. Please contact support.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = () => {
    purchaseMutation.mutate();
  };

  const handlePaymentSuccess = () => {
    confirmPurchaseMutation.mutate();
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
      <Card className="w-full max-w-lg mx-auto">
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

  const progressPercentage = usage ? Math.max(0, (usage.promptsRemaining / (usage.promptsRemaining + usage.promptsUsedThisMonth)) * 100) : 0;
  const isLowOnPrompts = usage && usage.promptsRemaining <= 10;

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Current Usage Display */}
      <Card className="border-2 border-gradient-to-r from-purple-200 to-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            AI Prompt Usage
            <Badge variant={isLowOnPrompts ? "destructive" : "default"}>
              {usage?.currentPlan.toUpperCase() || 'FREE'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Prompts Remaining</span>
              <span className={`font-bold ${isLowOnPrompts ? 'text-red-600' : 'text-green-600'}`}>
                {usage?.promptsRemaining || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  isLowOnPrompts ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Used this month: {usage?.promptsUsedThisMonth || 0}</span>
              <span>{progressPercentage.toFixed(0)}% remaining</span>
            </div>
          </div>

          {isLowOnPrompts && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Low on prompts!</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Top off your prompts to continue using AI features.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase Options */}
      {!showCheckout ? (
        <Card className="border-2 border-gradient-to-r from-purple-300 to-pink-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Top Off AI Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-dashed border-purple-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-lg">100 AI Prompts</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Perfect for continued journaling with AI assistance
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">✨ Instant delivery</Badge>
                    <Badge variant="secondary">🔄 Never expires</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">$2.99</div>
                  <div className="text-xs text-gray-500">Only $0.03 per prompt</div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePurchase}
              disabled={purchaseMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
            >
              {purchaseMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Preparing Purchase...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Purchase 100 Prompts - $2.99
                </div>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Secure payment powered by Stripe. Your prompts will be added instantly after payment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-gradient-to-r from-purple-300 to-pink-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Complete Your Purchase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
            
            <div className="flex justify-center mt-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowCheckout(false)}
                className="text-sm"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}