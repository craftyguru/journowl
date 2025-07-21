import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Share, Image, FileText, Link } from 'lucide-react';

export default function SharePage() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Parse URL parameters for shared content
    const urlParams = new URLSearchParams(window.location.search);
    const sharedTitle = urlParams.get('title') || '';
    const sharedText = urlParams.get('text') || '';
    const sharedUrl = urlParams.get('url') || '';
    
    setTitle(sharedTitle);
    setText(sharedText);
    setUrl(sharedUrl);
  }, []);

  const handleSave = async () => {
    if (!title && !text && !url && files.length === 0) {
      toast({
        title: "Nothing to Share",
        description: "Please add some content to share",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('text', text);
      formData.append('url', url);
      
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await fetch('/api/journal/share', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Shared Successfully",
          description: "Your shared content has been saved to your journal",
        });
        
        // Redirect to journal
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        throw new Error('Share failed');
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to save shared content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              🦉 Share to JournOwl
            </h1>
            <p className="text-white/80">
              Save shared content to your journal
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for this entry..."
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <Share className="w-4 h-4 inline mr-2" />
                Content
              </label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What would you like to share in your journal?"
                rows={6}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
              />
            </div>

            {url && (
              <div>
                <label className="block text-white font-medium mb-2">
                  <Link className="w-4 h-4 inline mr-2" />
                  Shared URL
                </label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Shared URL..."
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
            )}

            <div>
              <label className="block text-white font-medium mb-2">
                <Image className="w-4 h-4 inline mr-2" />
                Attachments
              </label>
              <input
                type="file"
                id="file-input"
                multiple
                accept="image/*,text/*"
                onChange={handleFileSelect}
                className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/20 file:text-white hover:file:bg-white/30"
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-medium">Attached Files:</h4>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-white/10 rounded"
                  >
                    {file.type.startsWith('image/') ? (
                      <Image className="w-4 h-4 text-white/60" />
                    ) : (
                      <FileText className="w-4 h-4 text-white/60" />
                    )}
                    <span className="text-white text-sm">{file.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              >
                {saving ? 'Saving...' : 'Save to Journal'}
              </Button>
              <Button
                onClick={() => window.close()}
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