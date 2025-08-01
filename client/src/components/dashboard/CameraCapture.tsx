import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Video, Square, Circle, Download, X, Image } from "lucide-react";

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File, type: 'photo' | 'video') => void;
}

export function CameraCapture({ isOpen, onClose, onCapture }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [isInitializing, setIsInitializing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    setIsInitializing(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: mediaType === 'video'
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
    setIsInitializing(false);
  }, [mediaType]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file, 'photo');
            setCapturedMedia(canvas.toDataURL());
          }
        }, 'image/jpeg', 0.9);
      }
    }
  }, [onCapture]);

  const startVideoRecording = useCallback(() => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
        onCapture(file, 'video');
        setCapturedMedia(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  }, [stream, onCapture]);

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('image/') ? 'photo' : 'video';
      onCapture(file, type);
      setCapturedMedia(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedMedia(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <Card className="border-none shadow-none">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Camera & Upload
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleClose} className="text-white hover:bg-white/20">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={mediaType === 'photo' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setMediaType('photo')}
                    className="text-white hover:bg-white/20"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Photo
                  </Button>
                  <Button
                    variant={mediaType === 'video' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setMediaType('video')}
                    className="text-white hover:bg-white/20"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {!stream && !capturedMedia ? (
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={startCamera}
                        disabled={isInitializing}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isInitializing ? 'Starting Camera...' : 'Start Camera'}
                      </Button>
                      <div className="text-sm text-gray-500">or</div>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Image className="w-4 h-4 mr-2" />
                        Upload from Gallery
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                ) : capturedMedia ? (
                  <div className="text-center space-y-4">
                    {mediaType === 'photo' ? (
                      <img src={capturedMedia} alt="Captured" className="max-w-full h-auto rounded-lg" />
                    ) : (
                      <video src={capturedMedia} controls className="max-w-full h-auto rounded-lg" />
                    )}
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => {
                          setCapturedMedia(null);
                          startCamera();
                        }}
                        variant="outline"
                      >
                        Take Another
                      </Button>
                      <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    
                    <div className="flex gap-2 justify-center">
                      {mediaType === 'photo' ? (
                        <Button
                          onClick={capturePhoto}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </Button>
                      ) : (
                        <Button
                          onClick={isRecording ? stopVideoRecording : startVideoRecording}
                          className={isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
                        >
                          {isRecording ? (
                            <>
                              <Square className="w-4 h-4 mr-2" />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <Circle className="w-4 h-4 mr-2" />
                              Start Recording
                            </>
                          )}
                        </Button>
                      )}
                      
                      <Button variant="outline" onClick={stopCamera}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}