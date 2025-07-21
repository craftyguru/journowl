import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, Image, Download } from 'lucide-react';

export default function ImportPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
  };

  const handleImport = async () => {
    if (files.length === 0) return;

    setImporting(true);
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${files.length} file(s) to your journal`,
        });
        setFiles([]);
      } else {
        throw new Error('Import failed');
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Unable to import files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (file.type.startsWith('text/')) return <FileText className="w-6 h-6" />;
    return <Upload className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              🦉 Import to JournOwl
            </h1>
            <p className="text-white/80">
              Import text files, images, or journal entries into your JournOwl
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-white/60 mb-4" />
              <input
                type="file"
                id="file-input"
                multiple
                accept=".txt,.md,.jpg,.jpeg,.png,.gif,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer text-white hover:text-white/80"
              >
                <div className="text-lg font-semibold mb-2">
                  Choose files to import
                </div>
                <div className="text-sm text-white/60">
                  Supports: Text files (.txt, .md), Images (.jpg, .png, .gif), JSON exports
                </div>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold">Selected Files:</h3>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg"
                  >
                    {getFileIcon(file)}
                    <div className="flex-1">
                      <div className="text-white font-medium">{file.name}</div>
                      <div className="text-white/60 text-sm">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={handleImport}
                disabled={files.length === 0 || importing}
                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              >
                {importing ? 'Importing...' : `Import ${files.length} File(s)`}
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}