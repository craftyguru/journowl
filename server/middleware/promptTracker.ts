import { storage } from '../storage';

// Middleware to track AI prompt usage and cost
export async function trackPromptUsage(userId: number, promptType: string, tokens?: number): Promise<void> {
  try {
    // Increment user's prompt usage count
    await storage.incrementPromptUsage(userId);
    
    // Calculate storage usage if content was generated and saved
    if (tokens) {
      await storage.updateStorageUsage(userId, Math.ceil(tokens / 1000)); // Rough estimation: 1KB per 1000 tokens
    }
    
    console.log(`[PROMPT TRACKING] User ${userId} used ${promptType} - Tokens: ${tokens || 'N/A'}`);
  } catch (error) {
    console.error(`[PROMPT TRACKING ERROR] Failed to track usage for user ${userId}:`, error);
    // Don't throw - tracking failures shouldn't break functionality
  }
}

// Wrapper for OpenAI calls that automatically tracks usage
export async function trackableOpenAICall<T>(
  userId: number, 
  promptType: string, 
  apiCall: () => Promise<T>,
  estimatedTokens?: number
): Promise<T> {
  try {
    // Check if user has remaining prompts
    const usage = await storage.getUserPromptUsage(userId);
    if (usage.promptsRemaining <= 0) {
      throw new Error('No prompts remaining. Please purchase more prompts to continue.');
    }
    
    // Make the API call
    const result = await apiCall();
    
    // Track the usage
    await trackPromptUsage(userId, promptType, estimatedTokens);
    
    return result;
  } catch (error) {
    if (error.message === 'No prompts remaining. Please purchase more prompts to continue.') {
      throw error; // Re-throw prompt limit errors
    }
    
    // For other errors, still track usage if it was likely sent to OpenAI
    if (!error.message.includes('API key')) {
      await trackPromptUsage(userId, `${promptType}_failed`, estimatedTokens);
    }
    
    throw error;
  }
}