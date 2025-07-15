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
