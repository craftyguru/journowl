import OpenAI from "openai";
import FormData from "form-data";
import { trackableOpenAICall } from "../middleware/promptTracker";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AudioAnalysis {
  transcription: string;
  summary: string;
  emotions: string[];
  keyTopics: string[];
  mood: string;
  journalPrompts: string[];
  insights: string[];
  duration: string;
  wordCount: number;
}

export async function transcribeAndAnalyzeAudio(audioBuffer: Buffer, filename: string): Promise<AudioAnalysis> {
  try {
    // Create a file object for OpenAI Whisper
    const file = new File([audioBuffer], filename, { 
      type: filename.endsWith('.wav') ? 'audio/wav' : 
            filename.endsWith('.mp3') ? 'audio/mp3' : 
            filename.endsWith('.webm') ? 'audio/webm' : 
            filename.endsWith('.ogg') ? 'audio/ogg' : 'audio/mpeg'
    });

    console.log('🎵 Transcribing audio with OpenAI Whisper...');
    
    // Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en", // Can be made dynamic if needed
      response_format: "text"
    });

    console.log('📝 Transcription complete, analyzing content...');

    // Analyze the transcription content
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant specialized in analyzing audio transcriptions for journaling purposes. 
          Analyze the transcribed text and extract meaningful insights that would help someone reflect on their spoken thoughts.
          Focus on emotions, key topics, themes, and provide thoughtful journal prompts based on what they said.
          Return your analysis in JSON format with the specified structure.`
        },
        {
          role: "user",
          content: `Analyze this audio transcription for journaling insights:

"${transcription}"

Provide a comprehensive analysis in JSON format with:
- summary: A 1-2 sentence summary of what they talked about
- emotions: Array of emotions detected in their speech
- keyTopics: Main topics or themes they discussed
- mood: Overall mood (happy, contemplative, excited, etc.)
- journalPrompts: 3 thoughtful questions to help them journal about this topic
- insights: 2-3 meaningful observations about their thoughts or feelings
- wordCount: Number of words in the transcription

Return only valid JSON in this format:
{
  "summary": "string",
  "emotions": ["emotion1", "emotion2"],
  "keyTopics": ["topic1", "topic2"],
  "mood": "string",
  "journalPrompts": ["prompt1", "prompt2", "prompt3"],
  "insights": ["insight1", "insight2"],
  "wordCount": number
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysisText = analysisResponse.choices[0]?.message?.content;
    if (!analysisText) {
      throw new Error('No analysis response received');
    }

    // Log the raw response for debugging
    console.log('🔍 Raw OpenAI response:', analysisText);

    // Clean the response - remove markdown code blocks if present
    let cleanedText = analysisText.trim();
    
    // Handle multiple code block formats
    if (cleanedText.includes('```json')) {
      cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/\s*```/g, '');
    } else if (cleanedText.includes('```')) {
      cleanedText = cleanedText.replace(/```\s*/g, '').replace(/\s*```/g, '');
    }
    
    // Remove any remaining backticks
    cleanedText = cleanedText.replace(/`/g, '');
    
    console.log('🧹 Cleaned text for parsing:', cleanedText);

    // Parse the JSON response with error handling
    let analysis;
    try {
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.error('🔍 Failed to parse text:', cleanedText);
      
      // Try to extract JSON from the text using regex
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('🔧 Attempting regex extraction:', jsonMatch[0]);
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract valid JSON from OpenAI response');
      }
    }

    // Calculate approximate duration (rough estimate: 150-200 words per minute)
    const avgWordsPerMinute = 175;
    const durationMinutes = Math.max(0.1, analysis.wordCount / avgWordsPerMinute);
    const minutes = Math.floor(durationMinutes);
    const seconds = Math.round((durationMinutes - minutes) * 60);
    const duration = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `0:${seconds.toString().padStart(2, '0')}`;

    return {
      transcription,
      summary: analysis.summary || "A voice recording was analyzed.",
      emotions: analysis.emotions || ["neutral"],
      keyTopics: analysis.keyTopics || ["personal thoughts"],
      mood: analysis.mood || "contemplative",
      journalPrompts: analysis.journalPrompts || [
        "What prompted you to record these thoughts?",
        "How do you feel about what you shared?",
        "What would you like to explore further about this topic?"
      ],
      insights: analysis.insights || ["Your voice captures thoughts in their raw, authentic form."],
      duration,
      wordCount: analysis.wordCount || transcription.split(' ').length
    };

  } catch (error) {
    console.error('Audio analysis failed:', error);
    
    // Return basic fallback analysis
    return {
      transcription: "Audio transcription failed",
      summary: "Audio recording captured but could not be analyzed",
      emotions: ["unknown"],
      keyTopics: ["audio recording"],
      mood: "neutral",
      journalPrompts: [
        "What were you thinking about when you made this recording?",
        "How might you describe your thoughts from this moment?",
        "What feelings or ideas would you like to explore further?"
      ],
      insights: ["Voice recordings can capture spontaneous thoughts and feelings."],
      duration: "unknown",
      wordCount: 0
    };
  }
}