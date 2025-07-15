import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PhotoAnalysis {
  description: string;
  emotions: string[];
  objects: string[];
  people: string[];
  activities: string[];
  location?: string;
  timeOfDay?: string;
  weather?: string;
  tags: string[];
  journalPrompts: string[];
  mood: string;
}

export async function analyzePhoto(base64Image: string): Promise<PhotoAnalysis> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant specialized in analyzing photos for journaling purposes. 
          Analyze the image and extract detailed information that would help someone journal about this moment.
          Focus on emotions, activities, people, objects, and context that could inspire meaningful writing.
          Provide journal prompts based on what you see.
          Return your analysis in JSON format with the specified structure.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this photo and provide a comprehensive analysis for journaling. 
              Include: description, emotions visible, objects/people present, activities happening, 
              suggested mood, relevant tags, and 3 journal prompts inspired by the image.
              Return in JSON format: { description, emotions, objects, people, activities, location, timeOfDay, weather, tags, journalPrompts, mood }`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      description: analysis.description || "A meaningful moment captured in time.",
      emotions: Array.isArray(analysis.emotions) ? analysis.emotions : [],
      objects: Array.isArray(analysis.objects) ? analysis.objects : [],
      people: Array.isArray(analysis.people) ? analysis.people : [],
      activities: Array.isArray(analysis.activities) ? analysis.activities : [],
      location: analysis.location || undefined,
      timeOfDay: analysis.timeOfDay || undefined,
      weather: analysis.weather || undefined,
      tags: Array.isArray(analysis.tags) ? analysis.tags : [],
      journalPrompts: Array.isArray(analysis.journalPrompts) ? analysis.journalPrompts : [
        "What emotions did this moment evoke for you?",
        "What story does this image tell about your day?",
        "How did this experience make you feel about yourself or your relationships?"
      ],
      mood: analysis.mood || "😊"
    };
  } catch (error) {
    console.error("Error analyzing photo:", error);
    throw new Error("Failed to analyze photo");
  }
}

export async function generateWritingPromptFromContext(context: {
  mood: string;
  previousContent?: string;
  photoAnalysis?: PhotoAnalysis[];
  tags?: string[];
  timeOfDay?: string;
}): Promise<string> {
  try {
    const photoContext = context.photoAnalysis?.map(p => p.description).join("; ") || "";
    const tagContext = context.tags?.join(", ") || "";
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a supportive AI journaling companion. Your role is to provide thoughtful, 
          personalized writing prompts that help users reflect deeply on their experiences and emotions.
          Be warm, encouraging, and insightful. Tailor prompts to their current mood and context.`
        },
        {
          role: "user",
          content: `Generate a personalized writing prompt for someone who is feeling ${context.mood}. 
          
          Context:
          - Current mood: ${context.mood}
          - Recent photos show: ${photoContext}
          - Related topics: ${tagContext}
          - Previous writing: ${context.previousContent?.slice(0, 200) || "None"}
          
          Create a thoughtful prompt that encourages deep reflection and meaningful journaling.
          Keep it to 1-2 sentences and make it feel personal and encouraging.`
        }
      ],
      max_tokens: 150,
    });

    return response.choices[0].message.content || "What's one thing that brought you joy today, and how can you carry that feeling forward?";
  } catch (error) {
    console.error("Error generating writing prompt:", error);
    throw new Error("Failed to generate writing prompt");
  }
}

export async function extractInsightsFromEntry(entry: {
  content: string;
  mood: string;
  photos?: any[];
  tags?: string[];
}): Promise<{
  insights: string[];
  themes: string[];
  suggestions: string[];
  moodAnalysis: string;
}> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an empathetic AI journal analyst. Analyze journal entries to provide meaningful 
          insights, identify themes, and offer gentle suggestions for personal growth and reflection.
          Be supportive, non-judgmental, and focus on helping the user understand their patterns and emotions.`
        },
        {
          role: "user",
          content: `Analyze this journal entry and provide insights:
          
          Content: "${entry.content}"
          Mood: ${entry.mood}
          Tags: ${entry.tags?.join(", ") || "None"}
          
          Provide analysis in JSON format:
          {
            "insights": ["key insights about emotions, experiences, or patterns"],
            "themes": ["main themes or topics discussed"],
            "suggestions": ["gentle suggestions for reflection or action"],
            "moodAnalysis": "brief analysis of the emotional tone"
          }`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      insights: Array.isArray(analysis.insights) ? analysis.insights : [],
      themes: Array.isArray(analysis.themes) ? analysis.themes : [],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
      moodAnalysis: analysis.moodAnalysis || "The entry reflects a thoughtful moment of self-reflection."
    };
  } catch (error) {
    console.error("Error extracting insights:", error);
    return {
      insights: ["Your willingness to reflect through journaling shows great self-awareness."],
      themes: ["Personal reflection"],
      suggestions: ["Continue exploring your thoughts and feelings through writing."],
      moodAnalysis: "A moment of personal reflection and growth."
    };
  }
}