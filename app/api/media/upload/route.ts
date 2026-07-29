import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const purpose = (formData.get('purpose') as string) || ''; // e.g. 'creator_cover' or 'creator_avatar'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString('base64');
    
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_QEH6sevZJ316f5zVNCz8HGcWY8k=';
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    // If purpose is specified, clean up previous file from ImageKit to keep clean key-value state
    if (purpose) {
      try {
        const searchRes = await fetch(`https://api.imagekit.io/v1/files?searchQuery=tags IN ("${purpose}")`, {
          headers: { 'Authorization': authHeader },
        });
        if (searchRes.ok) {
          const oldFiles = await searchRes.json();
          if (Array.isArray(oldFiles)) {
            for (const oldFile of oldFiles) {
              if (oldFile.fileId) {
                await fetch(`https://api.imagekit.io/v1/files/${oldFile.fileId}`, {
                  method: 'DELETE',
                  headers: { 'Authorization': authHeader },
                });
              }
            }
          }
        }
      } catch (cleanErr) {
        console.warn('ImageKit previous file cleanup note:', cleanErr);
      }
    }

    const fileName = purpose ? `${purpose}_${Date.now()}` : file.name;
    const uploadFormData = new FormData();
    uploadFormData.append('file', base64File);
    uploadFormData.append('fileName', fileName);
    uploadFormData.append('useUniqueFileName', 'false');
    uploadFormData.append('folder', '/smr-portfolio');
    if (purpose) {
      uploadFormData.append('tags', purpose);
    }

    const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: uploadFormData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('ImageKit upload error:', data);
      return NextResponse.json({ error: data.message || 'ImageKit upload failed' }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl || data.url,
      fileId: data.fileId,
      purpose,
    });
  } catch (err) {
    console.error('Upload handler server error:', err);
    return NextResponse.json({ error: 'Server error during upload handling' }, { status: 500 });
  }
}
