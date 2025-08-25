import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Note: Progress component may not be available, using div with background styling
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { 
  Trash2, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileText, 
  Download, 
  Eye,
  Calendar,
  HardDrive,
  Loader2,
  X
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';

interface StorageFile {
  id: string;
  type: 'photo' | 'video' | 'audio' | 'drawing' | 'text';
  name: string;
  size: number;
  url: string;
  uploadDate: string;
  entryTitle?: string;
  entryId?: number;
  path?: string;
  bucket?: string;
}

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  sizeByType: Record<string, number>;
  storageLimit: number;
  storageUsed: number;
}

interface StorageManagerProps {
  onClose: () => void;
}

export function StorageManager({ onClose }: StorageManagerProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingFiles, setDeletingFiles] = useState(false);
  const [previewFile, setPreviewFile] = useState<StorageFile | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch storage data
  const { data: storageData, isLoading } = useQuery({
    queryKey: ["/api/storage/files"],
  });

  const { data: storageStats } = useQuery({
    queryKey: ["/api/storage/stats"],
  });

  const files: StorageFile[] = (storageData as any)?.files || [];
  const stats: StorageStats = (storageStats as any) || {
    totalFiles: 0,
    totalSize: 0,
    sizeByType: {},
    storageLimit: 100,
    storageUsed: 1
  };

  // Delete files mutation
  const deleteFilesMutation = useMutation({
    mutationFn: async (fileIds: string[]) => {
      const response = await apiRequest("DELETE", "/api/storage/files", { fileIds });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/storage/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/storage/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      setSelectedFiles([]);
      toast({
        title: "Files Deleted",
        description: `Successfully deleted ${selectedFiles.length} file(s) and freed up space.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete files. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleDeleteFiles = () => {
    if (selectedFiles.length === 0) return;
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    setDeletingFiles(true);
    deleteFilesMutation.mutate(selectedFiles);
    setDeleteConfirmOpen(false);
    setDeletingFiles(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'photo': return <FileImage className="w-4 h-4" />;
      case 'video': return <FileVideo className="w-4 h-4" />;
      case 'audio': return <FileAudio className="w-4 h-4" />;
      case 'drawing': return <FileImage className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'photo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'video': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'audio': return 'bg-green-100 text-green-800 border-green-200';
      case 'drawing': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filesByType = files.reduce((acc, file) => {
    if (!acc[file.type]) acc[file.type] = [];
    acc[file.type].push(file);
    return acc;
  }, {} as Record<string, StorageFile[]>);

  const usagePercentage = (stats.storageUsed / stats.storageLimit) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading storage data...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-6xl mx-auto p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HardDrive className="w-8 h-8 text-blue-600" />
            Storage Manager
          </h1>
          <p className="text-gray-600 mt-1">Manage your files and free up space</p>
        </div>
        <Button onClick={onClose} variant="outline">
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>
      </div>

      {/* Storage Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">
                {formatFileSize(stats.storageUsed * 1024 * 1024)} of {formatFileSize(stats.storageLimit * 1024 * 1024)} used
              </span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {usagePercentage.toFixed(1)}%
              </Badge>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {Object.entries(stats.sizeByType).map(([type, size]) => (
                <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    {getFileIcon(type)}
                  </div>
                  <p className="text-sm font-medium capitalize">{type}s</p>
                  <p className="text-xs text-gray-600">{formatFileSize(size)}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              📁 Files ({stats.totalFiles})
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedFiles.length > 0 && (
                <Badge variant="secondary">
                  {selectedFiles.length} selected
                </Badge>
              )}
              <Button
                onClick={handleDeleteFiles}
                disabled={selectedFiles.length === 0 || deletingFiles}
                variant="destructive"
                size="sm"
              >
                {deletingFiles ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete Selected
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All Files</TabsTrigger>
              <TabsTrigger value="photo">Photos</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="drawing">Drawings</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <FileList 
                files={files}
                selectedFiles={selectedFiles}
                onSelect={setSelectedFiles}
                onPreview={setPreviewFile}
                getFileIcon={getFileIcon}
                getTypeColor={getTypeColor}
                formatFileSize={formatFileSize}
              />
            </TabsContent>

            {Object.entries(filesByType).map(([type, typeFiles]) => (
              <TabsContent key={type} value={type} className="mt-4">
                <FileList 
                  files={typeFiles}
                  selectedFiles={selectedFiles}
                  onSelect={setSelectedFiles}
                  onPreview={setPreviewFile}
                  getFileIcon={getFileIcon}
                  getTypeColor={getTypeColor}
                  formatFileSize={formatFileSize}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm File Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedFiles.length} file(s)? 
              This action cannot be undone and will free up storage space.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete Files
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </motion.div>
  );
}

// File List Component
interface FileListProps {
  files: StorageFile[];
  selectedFiles: string[];
  onSelect: (selected: string[]) => void;
  onPreview: (file: StorageFile) => void;
  getFileIcon: (type: string) => React.ReactNode;
  getTypeColor: (type: string) => string;
  formatFileSize: (bytes: number) => string;
}

function FileList({ 
  files, 
  selectedFiles, 
  onSelect, 
  onPreview, 
  getFileIcon, 
  getTypeColor, 
  formatFileSize 
}: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No files found</p>
      </div>
    );
  }

  const toggleFileSelection = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      onSelect(selectedFiles.filter(id => id !== fileId));
    } else {
      onSelect([...selectedFiles, fileId]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <Card 
          key={file.id}
          className={`transition-all hover:shadow-md cursor-pointer ${
            selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getFileIcon(file.type)}
                <Badge className={getTypeColor(file.type)} variant="outline">
                  {file.type}
                </Badge>
              </div>
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.id)}
                onChange={() => toggleFileSelection(file.id)}
                className="w-4 h-4"
              />
            </div>
            
            <h4 className="font-medium text-sm mb-1 truncate">{file.name}</h4>
            <p className="text-xs text-gray-600 mb-2">
              {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
            </p>
            
            {file.entryTitle && (
              <p className="text-xs text-blue-600 mb-2 truncate">
                From: {file.entryTitle}
              </p>
            )}
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onPreview(file)}
                size="sm"
                variant="outline"
                className="text-xs flex-1"
              >
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
              <Button
                onClick={() => window.open(file.url, '_blank')}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// File Preview Modal
interface FilePreviewModalProps {
  file: StorageFile;
  onClose: () => void;
}

function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {getFileIcon(file.type)}
            {file.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {formatFileSize(file.size)} • Uploaded {new Date(file.uploadDate).toLocaleString()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="max-h-96 overflow-auto">
          {file.type === 'photo' && (
            <img src={file.url} alt={file.name} className="w-full rounded-lg" />
          )}
          {file.type === 'video' && (
            <video controls className="w-full rounded-lg">
              <source src={file.url} />
              Your browser does not support video playback.
            </video>
          )}
          {file.type === 'audio' && (
            <audio controls className="w-full">
              <source src={file.url} />
              Your browser does not support audio playback.
            </audio>
          )}
          {file.type === 'drawing' && (
            <img src={file.url} alt={file.name} className="w-full rounded-lg bg-gray-100" />
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
          <AlertDialogAction onClick={() => window.open(file.url, '_blank')}>
            Download
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  function getFileIcon(type: string) {
    switch (type) {
      case 'photo': return <FileImage className="w-4 h-4" />;
      case 'video': return <FileVideo className="w-4 h-4" />;
      case 'audio': return <FileAudio className="w-4 h-4" />;
      case 'drawing': return <FileImage className="w-4 h-4 text-purple-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}