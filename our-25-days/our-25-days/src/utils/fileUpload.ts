import fs from 'fs';
import path from 'path';

export interface UploadResult {
  url: string;
  fileName: string;
}

export async function uploadToLocal(file: Buffer, fileName: string, contentType: string): Promise<UploadResult> {
  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFileName = `${timestamp}-${sanitizedFileName}`;
  
  // Determine file extension based on content type
  let extension = '';
  if (contentType.startsWith('image/')) {
    extension = contentType.split('/')[1];
    if (extension === 'jpeg') extension = 'jpg';
  } else if (contentType.startsWith('video/')) {
    extension = contentType.split('/')[1];
  } else if (contentType.startsWith('audio/')) {
    extension = contentType.split('/')[1];
  }
  
  const finalFileName = extension ? `${uniqueFileName.split('.')[0]}.${extension}` : uniqueFileName;
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Write file to uploads directory
  const filePath = path.join(uploadsDir, finalFileName);
  fs.writeFileSync(filePath, file);
  
  // Return URL that can be accessed from the frontend
  const url = `/uploads/${finalFileName}`;
  
  return {
    url,
    fileName: finalFileName
  };
}

export function getMediaType(contentType: string): string {
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('video/')) return 'video';
  if (contentType.startsWith('audio/')) return 'audio';
  return 'image'; // default fallback
} 