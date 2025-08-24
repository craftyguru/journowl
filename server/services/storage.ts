import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for storage
const supabaseUrl = process.env.SUPABASE_URL || 'https://asjcxaiabjsbjbasssfe.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseKey) {
  throw new Error('Supabase key not found in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface FileUploadResult {
  url: string;
  path: string;
  error?: string;
}

export async function uploadPhoto(
  userId: number, 
  file: Buffer, 
  filename: string
): Promise<FileUploadResult> {
  try {
    const fileExt = filename.split('.').pop();
    const timestamp = Date.now();
    const path = `user-${userId}/photo-${timestamp}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('journal-photos')
      .upload(path, file, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      console.error('Photo upload error:', error);
      return { url: '', path: '', error: error.message };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('journal-photos')
      .getPublicUrl(path);

    return {
      url: urlData.publicUrl,
      path: path
    };
  } catch (error) {
    console.error('Photo upload failed:', error);
    return { url: '', path: '', error: 'Upload failed' };
  }
}

export async function uploadAudio(
  userId: number, 
  file: Buffer, 
  filename: string
): Promise<FileUploadResult> {
  try {
    const fileExt = filename.split('.').pop() || 'wav';
    const timestamp = Date.now();
    const path = `user-${userId}/audio-${timestamp}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('journal-audio')
      .upload(path, file, {
        contentType: 'audio/wav',
        upsert: false
      });

    if (error) {
      console.error('Audio upload error:', error);
      return { url: '', path: '', error: error.message };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('journal-audio')
      .getPublicUrl(path);

    return {
      url: urlData.publicUrl,
      path: path
    };
  } catch (error) {
    console.error('Audio upload failed:', error);
    return { url: '', path: '', error: 'Upload failed' };
  }
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('File deletion error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('File deletion failed:', error);
    return false;
  }
}