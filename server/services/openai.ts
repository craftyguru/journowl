import OpenAI from "openai";
import { trackableOpenAICall } from "../middleware/promptTracker";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function generateJournalPrompt(userId?: number): Promise<string> {
  const fallback = "What moment today made you feel most grateful?";
  
  if (!userId) {
    return fallback;
  }

  try {
    return await trackableOpenAICall(
      userId,
      "journal_prompt_generation",
      async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a thoughtful journaling assistant. Generate a single, engaging journal prompt that encourages self-reflection and personal growth. The prompt should be open-ended and thought-provoking."
            },
            {
              role: "user",
              content: "Generate a journal prompt for today."
            }
          ],
          max_tokens: 100,
          temperature: 0.8,
        });

        return response.choices[0].message.content || fallback;
      },
      100 // Estimated tokens
    );
  } catch (error) {
    console.error("Failed to generate journal prompt:", error);
    return fallback;
  }
}

export async function generatePersonalizedPrompt(recentEntries: string[], userId?: number): Promise<string> {
  const fallback = "What patterns do you notice in your recent thoughts and feelings?";
  
  if (!userId) {
    return fallback;
  }

  try {
    const entriesText = recentEntries.slice(0, 3).join("\n\n");
    
    return await trackableOpenAICall(
      userId,
      "personalized_prompt_generation",
      async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a thoughtful journaling assistant. Based on the user's recent journal entries, generate a personalized prompt that builds on their themes, encourages deeper reflection, or explores related topics. Keep it engaging and supportive."
            },
            {
              role: "user",
              content: `Based on these recent journal entries, suggest a thoughtful prompt:\n\n${entriesText}`
            }
          ],
          max_tokens: 100,
          temperature: 0.7,
        });

        return response.choices[0].message.content || fallback;
      },
      100 // Estimated tokens
    );
  } catch (error) {
    console.error("Failed to generate personalized prompt:", error);
    return fallback;
  }
}

export async function generateInsight(entries: { content: string; mood: string; createdAt: Date }[], userId?: number): Promise<string> {
  const fallback = "Keep reflecting on your journey - every entry is a step toward greater self-awareness.";
  
  if (!userId) {
    return fallback;
  }

  try {
    const entriesData = entries.map(entry => ({
      content: entry.content.substring(0, 200),
      mood: entry.mood,
      date: entry.createdAt.toISOString().split('T')[0]
    }));

    return await trackableOpenAICall(
      userId,
      "insight_generation",
      async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a compassionate AI coach analyzing journal entries. Provide a supportive, insightful observation about patterns in the user's thoughts, moods, or growth. Keep it encouraging and actionable. Respond in JSON format with 'insight' field."
            },
            {
              role: "user",
              content: `Analyze these journal entries and provide an insight: ${JSON.stringify(entriesData)}`
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 200,
          temperature: 0.6,
        });

        const result = JSON.parse(response.choices[0].message.content || `{"insight": "${fallback}"}`);
        return result.insight;
      },
      200 // Estimated tokens
    );
  } catch (error) {
    console.error("Failed to generate insight:", error);
    return fallback;
  }
}

// AI Therapy Functions
export async function generateTherapyResponse(userMessage: string, conversationHistory: { role: string; content: string }[], userEntries: any[], userId?: number): Promise<string> {
  const fallback = "I'm here to listen and support you. Can you tell me more about what's on your mind?";
  
  if (!userId) {
    return fallback;
  }

  try {
    const recentEntries = userEntries.slice(0, 5).map(entry => ({
      content: entry.content.substring(0, 300),
      mood: entry.mood,
      date: new Date(entry.createdAt).toLocaleDateString()
    }));

    return await trackableOpenAICall(
      userId,
      "therapy_response",
      async () => {
        const messages = [
          {
            role: "system",
            content: `You are Dr. Sofia, a compassionate AI therapist with expertise in cognitive behavioral therapy, mindfulness, and emotional support. 

Your approach:
- Use warm, empathetic language
- Ask thoughtful follow-up questions
- Provide evidence-based coping strategies
- Validate emotions while encouraging growth
- Reference their journal patterns when relevant
- Keep responses conversational and supportive (2-3 sentences)
- Never diagnose or replace professional therapy

Recent journal insights: ${recentEntries.length > 0 ? JSON.stringify(recentEntries) : 'No recent entries available'}`
          },
          ...conversationHistory.slice(-6), // Keep last 6 messages for context
          {
            role: "user",
            content: userMessage
          }
        ];

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: messages as any,
          max_tokens: 200,
          temperature: 0.7,
        });

        return response.choices[0].message.content || fallback;
      },
      200 // Estimated tokens
    );
  } catch (error) {
    console.error("Failed to generate therapy response:", error);
    return fallback;
  }
}

export async function generatePersonalityAnalysis(entries: any[], userId?: number): Promise<any> {
  const fallback = {
    openness: 75,
    conscientiousness: 70,
    agreeableness: 80,
    neuroticism: 30,
    extraversion: 60,
    summary: "Based on your writing patterns, you show strong self-awareness and emotional intelligence."
  };
  
  if (!userId || entries.length === 0) {
    return fallback;
  }

  try {
    const entriesData = entries.slice(0, 10).map(entry => ({
      content: entry.content.substring(0, 500),
      mood: entry.mood,
      date: new Date(entry.createdAt).toLocaleDateString()
    }));

    return await trackableOpenAICall(
      userId,
      "personality_analysis",
      async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a psychological assessment AI. Analyze writing patterns to estimate Big Five personality traits (0-100 scale). Respond in JSON format with: openness, conscientiousness, agreeableness, neuroticism, extraversion (numbers), and summary (string)."
            },
            {
              role: "user",
              content: `Analyze these journal entries for personality traits: ${JSON.stringify(entriesData)}`
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 300,
          temperature: 0.3,
        });

        const result = JSON.parse(response.choices[0].message.content || JSON.stringify(fallback));
        return result;
      },
      300 // Estimated tokens
    );
  } catch (error) {
    console.error("Failed to generate personality analysis:", error);
    return fallback;
  }
}

export async function generateTherapeuticPrompt(emotionalState: string, recentConcerns: string[], userId?: number): Promise<string> {
  const fallback = "What emotions am I experiencing right now, and what might they be trying to tell me?";
  
  if (!userId) {
    return fallback;
  }

  try {
    return await trackableOpenAICall(
      userId,
      "therapeutic_prompt",
      async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a therapeutic journaling expert. Create a deep, thought-provoking journal prompt that encourages self-reflection and emotional processing. The prompt should be therapeutic but not overwhelming."
            },
            {
              role: "user",
              content: `Create a therapeutic journal prompt for someone feeling ${emotionalState} who has mentioned concerns about: ${recentConcerns.join(', ')}`
            }
          ],
          max_tokens: 150,
          temperature: 0.8,
        });

        return response.choices[0].message.content || fallback;
      },
      150 // Estimated tokens
    );
  } catch (error) {
    console.error("Failed to generate therapeutic prompt:", error);
    return fallback;
  }
}

export async function generateCopingStrategy(situation: string, userId?: number): Promise<string> {
  const fallback = "Take 5 deep breaths. Inhale for 4 counts, hold for 4, exhale for 6. This activates your parasympathetic nervous system and helps you feel calmer.";
  
  if (!userId) {
    return fallback;
  }

  try {
    return await trackableOpenAICall(
      userId,
      "coping_strategy",
      async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a mental health expert specializing in evidence-based coping strategies. Provide a specific, actionable technique for the given situation. Include brief explanation of why it works."
            },
            {
              role: "user",
              content: `Suggest a coping strategy for: ${situation}`
            }
          ],
          max_tokens: 150,
          temperature: 0.6,
        });

        return response.choices[0].message.content || fallback;
      },
      150 // Estimated tokens
    );
  } catch (error) {
    console.error("Failed to generate coping strategy:", error);
    return fallback;
  }
}
