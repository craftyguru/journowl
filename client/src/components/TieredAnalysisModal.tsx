import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AnalysisTierSelector, AnalysisTier } from '@/components/AnalysisTierSelector';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from "@/hooks/use-toast";

interface TieredAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (analysis: any) => void;
  mediaType: 'audio' | 'video' | 'photo';
  fileData?: {
    buffer?: Buffer;
    base64?: string;
    filename?: string;
    estimatedDuration?: number;
    fileSize?: number;
  };
}

export function TieredAnalysisModal({
  isOpen,
  onClose,
  onAnalysisComplete,
  mediaType,
  fileData
}: TieredAnalysisModalProps) {
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Fetch user's prompt balance
  const { data: promptUsage, refetch: refetchPromptUsage } = useQuery({
    queryKey: ["/api/prompts/usage"],
    enabled: isOpen,
  });

  // Fetch analysis tiers
  const { data: tiersData, isLoading: loadingTiers } = useQuery({
    queryKey: ["/api/ai/analysis-tiers", fileData?.estimatedDuration, fileData?.fileSize],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (fileData?.estimatedDuration) params.append('duration', fileData.estimatedDuration.toString());
      if (fileData?.fileSize) params.append('fileSize', fileData.fileSize.toString());
      
      const response = await apiRequest("GET", `/api/ai/analysis-tiers?${params}`);
      return response.json();
    },
    enabled: isOpen,
  });

  const remainingPrompts = (promptUsage as any)?.promptsRemaining || 0;
  const tiers: AnalysisTier[] = tiersData?.tiers || [];
  const suggestedTier = tiersData?.suggested;

  // Auto-select suggested tier on load
  useEffect(() => {
    if (suggestedTier?.id && !selectedTierId) {
      setSelectedTierId(suggestedTier.id);
    }
  }, [suggestedTier, selectedTierId]);

  const handleAnalyze = async () => {
    if (!selectedTierId || !fileData) {
      toast({
        title: "Error",
        description: "Please select an analysis tier and ensure file data is available.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let analysis;
      
      if (mediaType === 'photo') {
        // Photo analysis
        const response = await apiRequest("POST", "/api/ai/analyze-photo-tiered", {
          base64Image: fileData.base64,
          tierId: selectedTierId
        });
        analysis = await response.json();
      } else {
        // Audio/video analysis
        const formData = new FormData();
        
        if (fileData.buffer && fileData.filename) {
          const blob = new Blob([fileData.buffer], { type: `audio/${fileData.filename.split('.').pop()}` });
          formData.append('audio', blob, fileData.filename);
        }
        
        formData.append('tierId', selectedTierId);
        if (fileData.estimatedDuration) {
          formData.append('estimatedDuration', fileData.estimatedDuration.toString());
        }

        const response = await fetch('/api/ai/analyze-audio-tiered', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Analysis failed: ${response.statusText}`);
        }
        
        analysis = await response.json();
      }

      // Refresh prompt balance
      await refetchPromptUsage();
      
      // Pass analysis result back
      onAnalysisComplete(analysis);
      
      toast({
        title: "Analysis Complete! 🎉",
        description: `Your ${mediaType} has been analyzed successfully with AI insights.`,
      });
      
      onClose();
    } catch (error: any) {
      console.error("Analysis failed:", error);
      
      toast({
        title: "Analysis Failed",
        description: error.message || `Failed to analyze ${mediaType}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loadingTiers) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center p-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
            <span>Loading analysis options...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            🤖 AI {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} Analysis
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose how much of your {mediaType} you want our AI to analyze and get insights from.
          </DialogDescription>
        </DialogHeader>

        {tiers.length > 0 ? (
          <AnalysisTierSelector
            tiers={tiers}
            suggestedTierId={suggestedTier?.id}
            selectedTierId={selectedTierId}
            onTierSelect={setSelectedTierId}
            onConfirm={handleAnalyze}
            isLoading={isAnalyzing}
            mediaType={mediaType}
            estimatedDuration={fileData?.estimatedDuration}
            fileSize={fileData?.fileSize}
            remainingPrompts={remainingPrompts}
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No analysis tiers available at the moment.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}