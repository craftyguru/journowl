import { trackableOpenAICall } from "../middleware/promptTracker";
import { transcribeAndAnalyzeAudio } from "./audio-ai";
import { analyzePhoto } from "./photo-ai";

export interface AnalysisTier {
  id: string;
  name: string;
  maxDuration: number; // seconds for audio/video
  maxImageSize: number; // bytes for photos
  promptCost: number;
  description: string;
}

export const ANALYSIS_TIERS: AnalysisTier[] = [
  {
    id: "quick",
    name: "Quick Analysis",
    maxDuration: 30,
    maxImageSize: 2 * 1024 * 1024, // 2MB
    promptCost: 1,
    description: "0-30 seconds • Perfect for quick thoughts and snapshots"
  },
  {
    id: "standard",
    name: "Standard Analysis", 
    maxDuration: 120,
    maxImageSize: 5 * 1024 * 1024, // 5MB
    promptCost: 2,
    description: "31 seconds - 2 minutes • Detailed thoughts and moments"
  },
  {
    id: "deep",
    name: "Deep Analysis",
    maxDuration: 300,
    maxImageSize: 10 * 1024 * 1024, // 10MB
    promptCost: 3,
    description: "2-5 minutes • In-depth reflections and complex scenes"
  },
  {
    id: "extended",
    name: "Extended Analysis",
    maxDuration: 600,
    maxImageSize: 20 * 1024 * 1024, // 20MB
    promptCost: 4,
    description: "5-10 minutes • Long-form content and high-resolution media"
  }
];

export function getTierById(tierId: string): AnalysisTier | null {
  return ANALYSIS_TIERS.find(tier => tier.id === tierId) || null;
}

export function getTierByDuration(durationSeconds: number): AnalysisTier {
  return ANALYSIS_TIERS.find(tier => durationSeconds <= tier.maxDuration) 
    || ANALYSIS_TIERS[ANALYSIS_TIERS.length - 1]; // Default to highest tier
}

export function getTierByFileSize(sizeBytes: number): AnalysisTier {
  return ANALYSIS_TIERS.find(tier => sizeBytes <= tier.maxImageSize)
    || ANALYSIS_TIERS[ANALYSIS_TIERS.length - 1]; // Default to highest tier
}

// Truncate audio buffer to match selected tier duration
export function truncateAudioByTier(audioBuffer: Buffer, tierId: string, estimatedDurationSeconds: number): Buffer {
  const tier = getTierById(tierId);
  if (!tier || estimatedDurationSeconds <= tier.maxDuration) {
    return audioBuffer;
  }

  // Calculate approximate bytes to keep based on duration ratio
  const durationRatio = tier.maxDuration / estimatedDurationSeconds;
  const targetBytes = Math.floor(audioBuffer.length * durationRatio);
  
  return audioBuffer.slice(0, targetBytes);
}

// Resize/compress image based on tier limits
export function processImageByTier(base64Image: string, tierId: string): string {
  const tier = getTierById(tierId);
  if (!tier) return base64Image;

  // Calculate current size
  const currentSize = Buffer.from(base64Image, 'base64').length;
  
  if (currentSize <= tier.maxImageSize) {
    return base64Image;
  }

  // For now, just truncate the base64 string proportionally
  // In production, you'd want proper image resizing
  const compressionRatio = tier.maxImageSize / currentSize;
  const targetLength = Math.floor(base64Image.length * Math.sqrt(compressionRatio));
  
  return base64Image.slice(0, targetLength);
}

export async function analyzeAudioWithTier(
  userId: number,
  audioBuffer: Buffer, 
  filename: string,
  tierId: string,
  estimatedDuration?: number
): Promise<any> {
  const tier = getTierById(tierId);
  if (!tier) {
    throw new Error(`Invalid analysis tier: ${tierId}`);
  }

  // Truncate audio if necessary
  const processedBuffer = estimatedDuration 
    ? truncateAudioByTier(audioBuffer, tierId, estimatedDuration)
    : audioBuffer;

  // Use trackable OpenAI call with the tier's prompt cost
  return await trackableOpenAICall(
    userId,
    `audio_analysis_${tierId}`,
    async () => {
      return await transcribeAndAnalyzeAudio(processedBuffer, filename);
    },
    tier.promptCost * 200 // Rough token estimation
  );
}

export async function analyzePhotoWithTier(
  userId: number,
  base64Image: string,
  tierId: string
): Promise<any> {
  const tier = getTierById(tierId);
  if (!tier) {
    throw new Error(`Invalid analysis tier: ${tierId}`);
  }

  // Process image based on tier
  const processedImage = processImageByTier(base64Image, tierId);

  // Use trackable OpenAI call with the tier's prompt cost
  return await trackableOpenAICall(
    userId,
    `photo_analysis_${tierId}`,
    async () => {
      return await analyzePhoto(processedImage);
    },
    tier.promptCost * 150 // Rough token estimation  
  );
}

// Check if user can afford the analysis
export async function canAffordAnalysis(userId: number, tierId: string): Promise<boolean> {
  const { storage } = await import('../storage');
  const tier = getTierById(tierId);
  if (!tier) return false;

  const usage = await storage.getUserPromptUsage(userId);
  return usage.promptsRemaining >= tier.promptCost;
}

// Get estimated costs for UI display
export function getAnalysisCostEstimate(durationSeconds?: number, fileSizeBytes?: number): {
  suggestedTier: AnalysisTier;
  allTiers: AnalysisTier[];
} {
  let suggestedTier: AnalysisTier;
  
  if (durationSeconds !== undefined) {
    suggestedTier = getTierByDuration(durationSeconds);
  } else if (fileSizeBytes !== undefined) {
    suggestedTier = getTierByFileSize(fileSizeBytes);
  } else {
    suggestedTier = ANALYSIS_TIERS[0]; // Default to cheapest
  }

  return {
    suggestedTier,
    allTiers: ANALYSIS_TIERS
  };
}