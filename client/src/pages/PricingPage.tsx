import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

const plans = [
  {
    id: "free",
    name: "Free",
    icon: "✨",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "100 AI prompts/month",
      "Unlimited journal entries",
      "Basic mood tracking",
      "Weekly challenges (limited)",
      "Community access",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: "⚡",
    price: "$9.99",
    period: "per month",
    description: "For dedicated journalers",
    features: [
      "Unlimited AI prompts",
      "Advanced mood analytics",
      "All challenges + leaderboards",
      "AI-powered insights",
      "Export entries as PDF",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    id: "power",
    name: "Power User",
    icon: "👑",
    price: "$19.99",
    period: "per month",
    description: "Maximum features & AI power",
    features: [
      "Everything in Pro",
      "Custom AI personality",
      "Advanced analytics dashboard",
      "1-on-1 AI coaching sessions",
      "Team collaboration features",
      "API access for data export",
      "White-label support",
    ],
    cta: "Upgrade to Power",
    highlighted: false,
  },
];

export function PricingPage() {
  const { toast } = useToast();

  const upgradeMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (planId === "free") {
        toast({ title: "Already on Free plan" });
        return;
      }
      const res = await apiRequest("POST", "/api/stripe/create-payment-intent", {
        planId,
        amount: planId === "pro" ? 999 : 1999,
      });
      return res;
    },
    onSuccess: (data) => {
      if (data?.clientSecret) {
        toast({ title: "Redirecting to checkout..." });
        window.location.href = `/checkout?clientSecret=${data.clientSecret}`;
      }
    },
    onError: () => {
      toast({
        title: "Payment unavailable",
        description: "Stripe is not configured yet. Contact support.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-white mb-4">
          Choose Your JournOwl Plan
        </h1>
        <p className="text-xl text-gray-400">
          Unlock premium features to maximize your journaling journey
        </p>
      </motion.div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                className={`relative h-full overflow-hidden transition-all ${
                  plan.highlighted
                    ? "border-2 border-purple-500 shadow-2xl shadow-purple-500/20 md:scale-105"
                    : "border border-gray-700"
                }`}
                data-testid={`pricing-card-${plan.id}`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className="p-8 bg-gray-900/50">
                  {/* Plan Header */}
                  <div className="mb-6">
                    <div className="text-5xl mb-2">{plan.icon}</div>
                    <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 ml-2">/{plan.period}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full mb-6 font-semibold ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                    onClick={() => upgradeMutation.mutate(plan.id)}
                    disabled={upgradeMutation.isPending}
                    data-testid={`button-upgrade-${plan.id}`}
                  >
                    {upgradeMutation.isPending ? "Processing..." : plan.cta}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mt-20 px-4"
      >
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes! Cancel your subscription anytime from your account settings. No questions asked.",
            },
            {
              q: "Is there a free trial?",
              a: "Our free plan is essentially a trial. Upgrade when you're ready for premium features.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, Apple Pay, and Google Pay through Stripe.",
            },
            {
              q: "Do you offer refunds?",
              a: "Yes, 30-day money-back guarantee if you're not satisfied.",
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-4 bg-gray-800/50 border-gray-700">
              <p className="font-semibold text-white mb-2">{item.q}</p>
              <p className="text-gray-400 text-sm">{item.a}</p>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
