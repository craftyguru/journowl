import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  buffer?: Buffer;
  base64?: string;
  filename?: string;
  estimatedDuration?: number;
  fileSize?: number;
  type: 'audio' | 'video' | 'photo';
}

interface AnalysisResult {
  // Audio analysis result
  transcription?: string;
  summary?: string;
  emotions?: string[];
  keyTopics?: string[];
  mood?: string;
  journalPrompts?: string[];
  insights?: string[];
  duration?: string;
  wordCount?: number;

  // Photo analysis result
  description?: string;
  objects?: string[];
  people?: string[];
  activities?: string[];
  location?: string;
  timeOfDay?: string;
  weather?: string;
  tags?: string[];
}

export function useTieredMediaAnalysis() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentMediaFile, setCurrentMediaFile] = useState<MediaFile | null>(null);
  const { toast } = useToast();

  const analyzeAudio = useCallback((audioBlob: Blob, filename: string, estimatedDuration?: number) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(',')[1]; // Remove data URL prefix

      setCurrentMediaFile({
        base64: base64Data,
        filename,
        estimatedDuration,
        fileSize: audioBlob.size,
        type: 'audio'
      });
      setIsModalOpen(true);
    };
    reader.readAsDataURL(audioBlob);
  }, []);

  const analyzePhoto = useCallback((photoFile: File | string, estimatedSize?: number) => {
    if (typeof photoFile === 'string') {
      // Already base64 encoded
      const base64Data = photoFile.includes(',') ? photoFile.split(',')[1] : photoFile;
      
      setCurrentMediaFile({
        base64: base64Data,
        filename: 'photo.jpg',
        fileSize: estimatedSize || (base64Data.length * 0.75), // Rough estimate
        type: 'photo'
      });
      setIsModalOpen(true);
    } else {
      // File object
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1];

        setCurrentMediaFile({
          base64: base64Data,
          filename: photoFile.name,
          fileSize: photoFile.size,
          type: 'photo'
        });
        setIsModalOpen(true);
      };
      reader.readAsDataURL(photoFile);
    }
  }, []);

  const handleAnalysisComplete = useCallback((result: AnalysisResult) => {
    setAnalysisResult(result);
    toast({
      title: "AI Analysis Complete! 🎉",
      description: "Check the insights section for detailed analysis of your media.",
    });
  }, [toast]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentMediaFile(null);
  }, []);

  const clearResult = useCallback(() => {
    setAnalysisResult(null);
  }, []);

  return {
    // State
    isModalOpen,
    analysisResult,
    currentMediaFile,
    
    // Actions
    analyzeAudio,
    analyzePhoto,
    handleAnalysisComplete,
    closeModal,
    clearResult,
  };
}