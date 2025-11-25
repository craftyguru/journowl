import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class SummaryService {
  static async generateWeeklySummary(entries: any[]): Promise<{
    title: string;
    summary: string;
    highlights: string[];
    mood_arc: string;
    recommendations: string[];
  }> {
    if (entries.length === 0) {
      return {
        title: "No Entries This Week",
        summary: "Start journaling to get your weekly summary!",
        highlights: [],
        mood_arc: "No data",
        recommendations: ["Write your first entry today!"]
      };
    }

    try {
      const entriesSummary = entries
        .slice(-7)
        .map(e => `${e.title}: "${e.content.substring(0, 150)}..."`)
        .join("\n");

      const [summaryResponse, highlightsResponse, recommendationsResponse] = await Promise.all([
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: `Summarize this week's journal entries in 2-3 sentences:\n${entriesSummary}`
          }],
          max_tokens: 150,
          temperature: 0.7
        }),
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: `Extract 3 key positive moments or insights from these entries:\n${entriesSummary}\n\nRespond with 3 short highlights (1 sentence each), separated by newlines starting with "- "`
          }],
          max_tokens: 200,
          temperature: 0.7
        }),
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: `Based on these entries, give 3 actionable recommendations for next week:\n${entriesSummary}\n\nRespond with 3 recommendations separated by newlines starting with "- "`
          }],
          max_tokens: 200,
          temperature: 0.7
        })
      ]);

      const summary = summaryResponse.choices[0]?.message?.content || "Great week!";
      
      const highlightsText = highlightsResponse.choices[0]?.message?.content || "";
      const highlights = highlightsText.split("\n")
        .filter(h => h.trim().startsWith("-"))
        .map(h => h.replace(/^- /, "").trim())
        .slice(0, 3);

      const recommendationsText = recommendationsResponse.choices[0]?.message?.content || "";
      const recommendations = recommendationsText.split("\n")
        .filter(r => r.trim().startsWith("-"))
        .map(r => r.replace(/^- /, "").trim())
        .slice(0, 3);

      return {
        title: "Weekly Summary",
        summary,
        highlights: highlights.length > 0 ? highlights : ["Keep journaling!", "Reflect on your growth", "Stay consistent"],
        mood_arc: entries.length > 3 ? "Trending positive" : "Mixed week",
        recommendations: recommendations.length > 0 ? recommendations : ["Continue daily writing", "Explore deeper emotions", "Track patterns"]
      };
    } catch (error) {
      console.error("Error generating weekly summary:", error);
      return {
        title: "Weekly Summary",
        summary: "Keep journaling to unlock AI insights!",
        highlights: ["Consistent writing", "Emotional awareness", "Growth mindset"],
        mood_arc: "Building strength",
        recommendations: ["Continue daily journaling", "Reflect on patterns", "Practice gratitude"]
      };
    }
  }

  static async generateMonthlySummary(entries: any[]): Promise<{
    title: string;
    overview: string;
    top_themes: string[];
    growth_areas: string[];
    mood_evolution: string;
    next_month_focus: string[];
    stats: {
      total_entries: number;
      total_words: number;
      avg_mood: string;
    };
  }> {
    if (entries.length < 3) {
      return {
        title: "Monthly Summary",
        overview: "Write more entries this month to unlock full insights!",
        top_themes: [],
        growth_areas: [],
        mood_evolution: "Not enough data",
        next_month_focus: ["Daily journaling", "Emotional exploration"],
        stats: {
          total_entries: entries.length,
          total_words: entries.reduce((sum, e) => sum + (e.content?.split(" ").length || 0), 0),
          avg_mood: "Mixed"
        }
      };
    }

    try {
      const entriesSummary = entries
        .slice(-30)
        .map(e => `${e.title}: "${e.content.substring(0, 100)}..."`)
        .join("\n");

      const totalWords = entries.reduce((sum, e) => sum + (e.content?.split(" ").length || 0), 0);

      const [overviewResponse, themesResponse, growthResponse, evolutionResponse] = await Promise.all([
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: `Write a compelling 3-sentence monthly summary of this person's journal journey:\n${entriesSummary}`
          }],
          max_tokens: 200,
          temperature: 0.7
        }),
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: `Identify 3 main themes in these entries:\n${entriesSummary}\n\nRespond with 3 themes separated by newlines starting with "- "`
          }],
          max_tokens: 150,
          temperature: 0.7
        }),
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: `What are 3 areas of personal growth shown in these entries?:\n${entriesSummary}\n\nRespond with 3 growth areas separated by newlines starting with "- "`
          }],
          max_tokens: 150,
          temperature: 0.7
        }),
        openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: `Describe the mood evolution across this month in 1-2 sentences:\n${entriesSummary}`
          }],
          max_tokens: 100,
          temperature: 0.7
        })
      ]);

      const overview = overviewResponse.choices[0]?.message?.content || "Powerful month of reflection";
      
      const themesText = themesResponse.choices[0]?.message?.content || "";
      const top_themes = themesText.split("\n")
        .filter(t => t.trim().startsWith("-"))
        .map(t => t.replace(/^- /, "").trim())
        .slice(0, 3);

      const growthText = growthResponse.choices[0]?.message?.content || "";
      const growth_areas = growthText.split("\n")
        .filter(g => g.trim().startsWith("-"))
        .map(g => g.replace(/^- /, "").trim())
        .slice(0, 3);

      const mood_evolution = evolutionResponse.choices[0]?.message?.content || "Growing stronger";

      return {
        title: "Monthly Summary",
        overview,
        top_themes: top_themes.length > 0 ? top_themes : ["Self-reflection", "Growth", "Resilience"],
        growth_areas: growth_areas.length > 0 ? growth_areas : ["Emotional awareness", "Clarity", "Confidence"],
        mood_evolution,
        next_month_focus: ["Deepen insights", "Track progress", "Celebrate wins"],
        stats: {
          total_entries: entries.length,
          total_words: totalWords,
          avg_mood: "Positive"
        }
      };
    } catch (error) {
      console.error("Error generating monthly summary:", error);
      return {
        title: "Monthly Summary",
        overview: "Keep journaling to unlock monthly insights!",
        top_themes: ["Reflection", "Growth", "Mindfulness"],
        growth_areas: ["Awareness", "Resilience", "Clarity"],
        mood_evolution: "Positive trajectory",
        next_month_focus: ["Continue daily practice", "Explore patterns", "Document wins"],
        stats: {
          total_entries: entries.length,
          total_words: entries.reduce((sum, e) => sum + (e.content?.split(" ").length || 0), 0),
          avg_mood: "Improving"
        }
      };
    }
  }
}
