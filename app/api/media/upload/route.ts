import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const base64File = buffer.toString('base64');
    const fileName = file.name;

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_QEH6sevZJ316f5zVNCz8HGcWY8k=';
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', base64File);
    uploadFormData.append('fileName', fileName);
    uploadFormData.append('useUniqueFileName', 'true');
    uploadFormData.append('folder', '/smr-portfolio');

    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

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

    // Return the official optimized ImageKit CDN URL
    return NextResponse.json({
      success: true,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl || data.url,
      fileId: data.fileId,
    });
  } catch (err) {
    console.error('Upload handler server error:', err);
    return NextResponse.json({ error: 'Server error during upload handling' }, { status: 500 });
  }
}
