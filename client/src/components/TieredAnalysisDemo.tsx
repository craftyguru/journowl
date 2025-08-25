import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TieredAnalysisModal } from '@/components/TieredAnalysisModal';
import { useTieredMediaAnalysis } from '@/hooks/useTieredMediaAnalysis';
import { useQuery } from '@tanstack/react-query';
import { Clock, Image, Zap, Upload, Mic, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TieredAnalysisDemo() {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    name: string;
    type: 'audio' | 'photo';
    size: number;
    url: string;
    file?: File;
    blob?: Blob;
    duration?: number;
  }>>([]);

  const { toast } = useToast();
  
  const {
    isModalOpen,
    analysisResult,
    currentMediaFile,
    analyzeAudio,
    analyzePhoto,
    handleAnalysisComplete,
    closeModal,
    clearResult
  } = useTieredMediaAnalysis();

  // Fetch user's current prompt balance
  const { data: promptUsage } = useQuery({
    queryKey: ["/api/prompts/usage"],
  });

  const remainingPrompts = (promptUsage as any)?.promptsRemaining || 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'photo') => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (type === 'photo' && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        const newFile = {
          id: Date.now() + Math.random().toString(),
          name: file.name,
          type: 'photo' as const,
          size: file.size,
          url,
          file
        };
        setUploadedFiles(prev => [...prev, newFile]);
      } else if (type === 'audio' && file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        const newFile = {
          id: Date.now() + Math.random().toString(),
          name: file.name,
          type: 'audio' as const,
          size: file.size,
          url,
          file,
          duration: 30 // Estimate - in real app you'd calculate this
        };
        setUploadedFiles(prev => [...prev, newFile]);
      }
    });

    // Clear the input
    event.target.value = '';
  };

  const handleAnalyzeFile = (fileItem: typeof uploadedFiles[0]) => {
    if (fileItem.type === 'photo' && fileItem.file) {
      analyzePhoto(fileItem.file);
    } else if (fileItem.type === 'audio' && fileItem.file) {
      // Convert file to blob for audio analysis
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: fileItem.file!.type });
        analyzeAudio(blob, fileItem.name, fileItem.duration);
      };
      reader.readAsArrayBuffer(fileItem.file);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up object URLs to prevent memory leaks
      const removedFile = prev.find(f => f.id === fileId);
      if (removedFile?.url.startsWith('blob:')) {
        URL.revokeObjectURL(removedFile.url);
      }
      return updated;
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            🤖 Tiered AI Media Analysis Demo
          </CardTitle>
          <CardDescription className="text-base">
            Test the new cost-controlled AI analysis system! Upload photos or audio files, 
            choose your analysis tier, and see how much you want to spend on AI insights.
          </CardDescription>
          <div className="flex items-center gap-4 pt-2">
            <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
              <Zap className="w-4 h-4 mr-1" />
              {remainingPrompts} prompts remaining
            </Badge>
            <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
              Smart cost control enabled
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Upload Photos
            </CardTitle>
            <CardDescription>
              Test AI photo analysis with tiered pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e, 'photo')}
              className="hidden"
            />
            <Button 
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="w-full"
              variant="outline"
            >
              <Image className="w-4 h-4 mr-2" />
              Choose Photos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Upload Audio
            </CardTitle>
            <CardDescription>
              Test AI audio analysis with duration-based tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              id="audio-upload"
              accept="audio/*"
              multiple
              onChange={(e) => handleFileUpload(e, 'audio')}
              className="hidden"
            />
            <Button 
              onClick={() => document.getElementById('audio-upload')?.click()}
              className="w-full"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Audio Files
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
            <CardDescription>
              Click "Analyze" on any file to see the tiered pricing options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {file.type === 'photo' ? (
                      <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                        <Mic className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(file.size)}
                        {file.duration && (
                          <>
                            <span className="mx-1">•</span>
                            <Clock className="w-3 h-3 inline mr-1" />
                            ~{file.duration}s
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleAnalyzeFile(file)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      🤖 Analyze
                    </Button>
                    <Button
                      onClick={() => removeFile(file.id)}
                      size="sm"
                      variant="outline"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">✨ Analysis Complete!</CardTitle>
            <CardDescription className="text-green-700">
              Here's what AI discovered about your {currentMediaFile?.type}:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisResult.transcription && (
              <div>
                <h4 className="font-medium text-green-800">Transcription:</h4>
                <p className="text-green-700">{analysisResult.transcription}</p>
              </div>
            )}
            
            {analysisResult.description && (
              <div>
                <h4 className="font-medium text-green-800">Description:</h4>
                <p className="text-green-700">{analysisResult.description}</p>
              </div>
            )}

            {analysisResult.summary && (
              <div>
                <h4 className="font-medium text-green-800">Summary:</h4>
                <p className="text-green-700">{analysisResult.summary}</p>
              </div>
            )}

            {analysisResult.emotions && analysisResult.emotions.length > 0 && (
              <div>
                <h4 className="font-medium text-green-800">Emotions Detected:</h4>
                <div className="flex flex-wrap gap-1">
                  {analysisResult.emotions.map((emotion, idx) => (
                    <Badge key={idx} variant="secondary">{emotion}</Badge>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.journalPrompts && analysisResult.journalPrompts.length > 0 && (
              <div>
                <h4 className="font-medium text-green-800">Journal Prompts:</h4>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  {analysisResult.journalPrompts.map((prompt, idx) => (
                    <li key={idx}>{prompt}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={clearResult} variant="outline" size="sm">
              Clear Results
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tiered Analysis Modal */}
      <TieredAnalysisModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAnalysisComplete={handleAnalysisComplete}
        mediaType={currentMediaFile?.type || 'photo'}
        fileData={currentMediaFile || undefined}
      />
    </div>
  );
}