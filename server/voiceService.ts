import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { getUncachableStripeClient } from "./stripeClient";

const execAsync = promisify(exec);

export class VoiceService {
  // Transcribe audio file using OpenAI Whisper API
  static async transcribeAudio(audioPath: string): Promise<string> {
    try {
      const { OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const audioFile = fs.createReadStream(audioPath);

      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        language: "en",
      });

      return transcription.text;
    } catch (error) {
      console.error("Transcription error:", error);
      throw new Error("Failed to transcribe audio");
    }
  }

  // Convert webm to wav if needed
  static async convertAudio(inputPath: string, outputPath: string): Promise<void> {
    try {
      // FFmpeg command to convert webm to wav
      await execAsync(`ffmpeg -i "${inputPath}" -acodec pcm_s16le -ar 16000 "${outputPath}"`);
    } catch (error) {
      console.error("Audio conversion error:", error);
      // Whisper can handle webm directly, so this is optional
    }
  }

  // Generate tags from transcribed text using AI
  static async generateTags(text: string): Promise<string[]> {
    try {
      const { OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `Extract 3-5 key topics/tags from this journal entry. Return as comma-separated list only:\n\n"${text}"`,
          },
        ],
        max_tokens: 100,
      });

      const tagsText = response.choices[0].message.content || "";
      return tagsText.split(",").map((tag) => tag.trim().toLowerCase());
    } catch (error) {
      console.error("Tag generation error:", error);
      return [];
    }
  }

  // Detect mood from transcribed text
  static async detectMood(text: string): Promise<string> {
    try {
      const { OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `Detect the overall mood of this journal entry. Return ONE word only (happy, sad, anxious, calm, neutral, grateful, excited, angry):\n\n"${text}"`,
          },
        ],
        max_tokens: 20,
      });

      const mood = response.choices[0].message.content?.toLowerCase().trim() || "neutral";
      const validMoods = [
        "happy",
        "sad",
        "anxious",
        "calm",
        "neutral",
        "grateful",
        "excited",
        "angry",
      ];
      return validMoods.includes(mood) ? mood : "neutral";
    } catch (error) {
      console.error("Mood detection error:", error);
      return "neutral";
    }
  }
}
