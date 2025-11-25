import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Play, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function VoiceJournal({ onEntryCreated }: { onEntryCreated?: () => void }) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setDuration(0);

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      toast({ title: "🎙️ Recording started..." });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please enable microphone access to use voice journaling",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!audioURL) throw new Error("No audio recorded");

      const response = await fetch(audioURL);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const result = await fetch("/api/journal/voice" as any, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!result.ok) throw new Error("Failed to submit voice entry");
      return await result.json();
    },
    onSuccess: () => {
      toast({
        title: "✅ Voice entry created!",
        description: "Your entry has been transcribed and saved",
      });
      setAudioURL(null);
      setDuration(0);
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      onEntryCreated?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create voice entry",
        variant: "destructive",
      });
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30">
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Mic className="w-6 h-6 text-purple-400" />
        </motion.div>
        <h3 className="text-xl font-bold text-white">Voice Journal</h3>
      </div>

      <p className="text-gray-300 text-sm mb-4">
        🎙️ Speak freely - your voice will be transcribed into a journal entry
      </p>

      <div className="space-y-4">
        {/* Recording Controls */}
        <div className="flex gap-2">
          {!isRecording && !audioURL && (
            <Button
              onClick={startRecording}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              data-testid="button-start-recording"
            >
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-white font-semibold">{formatTime(duration)}</span>
              </div>
              <Button
                onClick={stopRecording}
                className="flex-1 bg-red-600 hover:bg-red-700"
                data-testid="button-stop-recording"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Audio Playback */}
        {audioURL && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <audio
              src={audioURL}
              controls
              className="w-full"
              data-testid="audio-playback"
            />

            <div className="flex gap-2">
              <Button
                onClick={submitMutation.mutate}
                disabled={submitMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700"
                data-testid="button-submit-voice"
              >
                <Play className="w-4 h-4 mr-2" />
                {submitMutation.isPending ? "Transcribing..." : "Create Entry"}
              </Button>

              <Button
                onClick={() => {
                  setAudioURL(null);
                  setDuration(0);
                }}
                variant="outline"
                data-testid="button-discard-recording"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
