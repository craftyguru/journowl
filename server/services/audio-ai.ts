import OpenAI from "openai";
import FormData from "form-data";
import { trackableOpenAICall } from "../middleware/promptTracker";
import { Readable } from "stream";

// Fix for Node.js compatibility with OpenAI SDK  
if (!globalThis.File) {
  // Simple File polyfill for Node.js
  globalThis.File = class File {
    name: string;
    lastModified: number;
    size: number;
    type: string;
    private data: any;
    
    constructor(fileBits: any[], name: string, options: any = {}) {
      this.name = name;
      this.lastModified = options.lastModified ?? Date.now();
      this.type = options.type || '';
      this.data = fileBits[0]; // Store the buffer
      this.size = fileBits[0]?.length || 0;
    }
    
    stream() {
      return Readable.from(this.data);
    }
    
    arrayBuffer() {
      return Promise.resolve(this.data.buffer);
    }
  } as any;
}

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

export async function transcribeAndAnalyzeAudio(audioBuffer: Buffer, filename: string, userId?: number): Promise<AudioAnalysis> {
  try {
    console.log('🎵 Transcribing audio with OpenAI Whisper...');
    console.log('📁 Audio file details:', { 
      filename, 
      bufferSize: audioBuffer.length,
      bufferType: typeof audioBuffer
    });
    
    // Create a File object for OpenAI (now that we have the global File)
    const audioFile = new File([audioBuffer], filename, { 
      type: filename.endsWith('.wav') ? 'audio/wav' : 
            filename.endsWith('.mp3') ? 'audio/mp3' : 
            filename.endsWith('.webm') ? 'audio/webm' : 
            filename.endsWith('.ogg') ? 'audio/ogg' : 
            filename.endsWith('.m4a') ? 'audio/m4a' : 'audio/wav' // Default to wav
    });
    
    // Transcribe audio using Whisper with enhanced error handling
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
      response_format: "text"
    });
    
    console.log('✅ Transcription successful length:', transcription?.length || 0);
    console.log('📝 First 100 chars:', transcription?.substring(0, 100) || 'No transcription content');
    
    if (!transcription || transcription.trim().length === 0) {
      throw new Error('Empty transcription received from Whisper');
    }

    console.log('📝 Transcription complete, analyzing content...');

    // Analyze the transcription content using trackable OpenAI call
    const analysisResponse = await (userId ? 
      trackableOpenAICall(
        userId,
        "audio_content_analysis",
        async () => await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
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
      max_completion_tokens: 1000
        }),
        400 // Estimated tokens for audio analysis
      ) : 
      openai.chat.completions.create({
        model: "gpt-5",
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
        max_completion_tokens: 1000
      })
    );

    const analysisText = analysisResponse.choices[0]?.message?.content;
    console.log('🤖 Analysis response:', analysisText);
    
    if (!analysisText) {
      console.log('❌ Empty analysis response, creating fallback analysis');
      // Create fallback analysis for short or unclear transcriptions
      const fallbackAnalysis = {
        summary: transcription.length > 10 ? `Brief audio recording: "${transcription}"` : "Short audio recording captured",
        emotions: ["neutral"],
        keyTopics: transcription.length > 5 ? ["audio recording"] : ["voice note"],
        mood: "neutral",
        journalPrompts: [
          "What was the context behind this recording?",
          "How did you feel when you recorded this?",
          "What thoughts does this audio bring to mind?"
        ],
        insights: [
          "Audio captured for journaling purposes",
          "Consider adding more context about this moment"
        ],
        wordCount: transcription.trim().split(/\s+/).length
      };
      
      return {
        transcription,
        summary: fallbackAnalysis.summary,
        emotions: fallbackAnalysis.emotions,
        keyTopics: fallbackAnalysis.keyTopics,
        mood: fallbackAnalysis.mood,
        journalPrompts: fallbackAnalysis.journalPrompts,
        insights: fallbackAnalysis.insights,
        duration: "momentary",
        wordCount: fallbackAnalysis.wordCount
      };
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
    console.error('❌ Audio analysis failed:', error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3)
    });
    
    // Return enhanced fallback analysis with debugging info
    return {
      transcription: `Audio transcription failed: ${error.message}`,
      summary: "Audio recording captured but could not be analyzed due to technical issues",
      emotions: ["unknown"],
      keyTopics: ["audio recording", "technical issue"],
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