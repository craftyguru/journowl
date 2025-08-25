import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Image, Zap, DollarSign, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalysisTier {
  id: string;
  name: string;
  maxDuration: number;
  maxImageSize: number;
  promptCost: number;
  description: string;
}

interface AnalysisTierSelectorProps {
  tiers: AnalysisTier[];
  suggestedTierId?: string;
  selectedTierId?: string;
  onTierSelect: (tierId: string) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  mediaType: 'audio' | 'video' | 'photo';
  estimatedDuration?: number;
  fileSize?: number;
  remainingPrompts: number;
}

export function AnalysisTierSelector({
  tiers,
  suggestedTierId,
  selectedTierId,
  onTierSelect,
  onConfirm,
  isLoading = false,
  mediaType,
  estimatedDuration,
  fileSize,
  remainingPrompts
}: AnalysisTierSelectorProps) {
  const [selectedId, setSelectedId] = useState(selectedTierId || suggestedTierId || tiers[0]?.id);

  const handleTierSelect = (tierId: string) => {
    setSelectedId(tierId);
    onTierSelect(tierId);
  };

  const selectedTier = tiers.find(tier => tier.id === selectedId);
  const canAfford = selectedTier ? remainingPrompts >= selectedTier.promptCost : false;

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  const getIconForMediaType = () => {
    switch (mediaType) {
      case 'audio': return <Clock className="w-5 h-5" />;
      case 'video': return <Clock className="w-5 h-5" />;
      case 'photo': return <Image className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-lg font-semibold">
          {getIconForMediaType()}
          Choose AI Analysis Level
        </div>
        <p className="text-sm text-muted-foreground">
          Select how much of your {mediaType} you want AI to analyze
        </p>
        {estimatedDuration && (
          <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
            📊 Detected: {formatDuration(estimatedDuration)} of {mediaType}
          </div>
        )}
        {fileSize && mediaType === 'photo' && (
          <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
            📁 File size: {formatFileSize(fileSize)}
          </div>
        )}
      </div>

      {/* Tier Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tiers.map((tier) => {
          const isSelected = selectedId === tier.id;
          const isSuggested = tier.id === suggestedTierId;
          const affordable = remainingPrompts >= tier.promptCost;
          
          return (
            <Card
              key={tier.id}
              className={cn(
                "cursor-pointer border-2 transition-all duration-200 hover:shadow-md relative",
                isSelected 
                  ? "border-blue-500 bg-blue-50 shadow-md" 
                  : affordable
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-red-200 bg-red-50 opacity-70 cursor-not-allowed"
              )}
              onClick={() => affordable && handleTierSelect(tier.id)}
            >
              {isSuggested && (
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                  Recommended
                </Badge>
              )}
              
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {tier.name}
                  {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                </CardTitle>
                <CardDescription className="text-xs">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{tier.promptCost} prompts</span>
                  </div>
                  {!affordable && (
                    <Badge variant="destructive" className="text-xs">
                      Need {tier.promptCost - remainingPrompts} more
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  {mediaType === 'photo' ? (
                    <div>Max file size: {formatFileSize(tier.maxImageSize)}</div>
                  ) : (
                    <div>Max duration: {formatDuration(tier.maxDuration)}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Balance */}
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span>You have <strong>{remainingPrompts} prompts</strong> remaining</span>
        </div>
        {selectedTier && canAfford && (
          <div className="text-xs text-green-600 mt-1">
            ✓ After analysis: {remainingPrompts - selectedTier.promptCost} prompts left
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button
        onClick={onConfirm}
        disabled={!canAfford || isLoading || !selectedTier}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing...
          </div>
        ) : !canAfford ? (
          "Not Enough Prompts"
        ) : selectedTier ? (
          `Analyze with ${selectedTier.name} (${selectedTier.promptCost} prompts)`
        ) : (
          "Select a Tier"
        )}
      </Button>

      {!canAfford && selectedTier && (
        <div className="text-center">
          <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
            Buy More Prompts
          </Button>
        </div>
      )}
    </div>
  );
}