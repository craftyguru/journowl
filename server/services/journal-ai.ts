import OpenAI from "openai";
import { trackableOpenAICall } from "../middleware/promptTracker";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askQuestionAboutJournal(
  question: string, 
  entries: any[], 
  stats: any,
  userId: number
): Promise<string> {
  const fallback = "I couldn't analyze your question right now. Please try again.";
  
  try {
    // Prepare context about the user's journal data
    const journalContext = entries.slice(0, 10).map(entry => ({
      date: entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Unknown',
      title: entry.title || 'Untitled',
      content: entry.content?.substring(0, 500) || '', // Limit content length
      mood: entry.mood || 'neutral',
      tags: entry.tags || [],
      wordCount: entry.wordCount || 0
    }));

    const contextSummary = `
User's Journal Statistics:
- Total entries: ${stats.totalEntries || 0}
- Total words written: ${stats.totalWords || 0}
- Current streak: ${stats.currentStreak || 0} days
- Longest streak: ${stats.longestStreak || 0} days
- Average words per entry: ${stats.averageWords || 0}
- Most frequent mood: ${stats.mostFrequentMood || 'Unknown'}

Recent Journal Entries:
${journalContext.map(entry => `
Date: ${entry.date}
Title: ${entry.title}
Mood: ${entry.mood}
Content: ${entry.content}
Tags: ${entry.tags.join(', ')}
Word Count: ${entry.wordCount}
`).join('\n---\n')}
    `;

    return await trackableOpenAICall(
      userId,
      "ai_question_analysis",
      async () => {
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: `You are a wise journaling assistant helping users understand their writing patterns and emotional journey. 

Analyze the provided journal data and answer questions about:
- Writing patterns and habits
- Mood trends and emotional insights
- Content themes and topics
- Streak patterns and consistency
- Growth and progress over time
- Specific dates, entries, or periods

Be supportive, insightful, and specific in your responses. Reference actual data from their entries when possible. Keep responses concise but meaningful (2-3 sentences max).

Always be encouraging and focus on positive growth while acknowledging challenges when relevant.`
            },
            {
              role: "user",
              content: `Based on my journal data below, please answer this question: "${question}"

${contextSummary}`
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        });

        return response.choices[0].message.content || fallback;
      },
      300 // Estimated tokens for this type of analysis
    );
  } catch (error) {
    console.error('Error asking AI question:', error);
    throw new Error('Failed to process AI question');
  }
}