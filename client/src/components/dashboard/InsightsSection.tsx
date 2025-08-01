import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, Lightbulb, TrendingUp, Heart, Sparkles, RefreshCw } from "lucide-react";

interface InsightsSectionProps {
  insights: string[];
  onRefreshInsights: () => void;
}

export function InsightsSection({ insights, onRefreshInsights }: InsightsSectionProps) {
  const getInsightIcon = (insight: string) => {
    const lowerInsight = insight.toLowerCase();
    if (lowerInsight.includes('mood') || lowerInsight.includes('feeling')) return '😊';
    if (lowerInsight.includes('growth') || lowerInsight.includes('progress')) return '📈';
    if (lowerInsight.includes('creative') || lowerInsight.includes('imagination')) return '🎨';
    if (lowerInsight.includes('relationship') || lowerInsight.includes('connect')) return '💝';
    if (lowerInsight.includes('goal') || lowerInsight.includes('achieve')) return '🎯';
    if (lowerInsight.includes('reflection') || lowerInsight.includes('think')) return '🤔';
    return '💡';
  };

  const getInsightColor = (index: number) => {
    const colors = [
      'from-blue-50 to-blue-100 border-blue-200',
      'from-green-50 to-green-100 border-green-200',
      'from-purple-50 to-purple-100 border-purple-200',
      'from-orange-50 to-orange-100 border-orange-200',
      'from-pink-50 to-pink-100 border-pink-200',
      'from-indigo-50 to-indigo-100 border-indigo-200'
    ];
    return colors[index % colors.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Insights & Recommendations
            </CardTitle>
            <Button
              onClick={onRefreshInsights}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Insights Yet</h3>
              <p className="text-gray-500 mb-4">
                Write a few journal entries to get personalized AI insights about your thoughts and patterns.
              </p>
              <Button onClick={onRefreshInsights} className="bg-purple-600 hover:bg-purple-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Insights
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 bg-gradient-to-br ${getInsightColor(index)} hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-sm">
                      {getInsightIcon(insight)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">{insight}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          AI Generated
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Insight #{index + 1}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Pro Tip</h4>
                </div>
                <p className="text-purple-700 text-sm">
                  The more you journal, the more personalized and accurate these insights become. 
                  Try writing about different aspects of your life for richer analysis!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}