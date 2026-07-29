import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url, isPremium, price } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Media URL is required' }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_QEH6sevZJ316f5zVNCz8HGcWY8k=';
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    // 1. Fetch current premium map config from ImageKit
    let premiumMap: Record<string, string> = {};
    try {
      const configRes = await fetch('https://api.imagekit.io/v1/files?tags=premium_map_config', {
        headers: { 'Authorization': authHeader },
        cache: 'no-store',
      });
      if (configRes.ok) {
        const configFiles = await configRes.json();
        if (Array.isArray(configFiles) && configFiles.length > 0) {
          const fileUrl = configFiles[0].url;
          const contentRes = await fetch(fileUrl, { cache: 'no-store' });
          if (contentRes.ok) {
            const parsed = await contentRes.json();
            premiumMap = parsed.premiumMap || {};
          }
        }
      }
    } catch (e) {
      console.warn('Failed to fetch premium map config file:', e);
    }

    // 2. Modify map
    if (isPremium) {
      premiumMap[url] = price || '$9.99';
    } else {
      if (premiumMap[url]) {
        delete premiumMap[url];
      }
    }

    // 3. Purge old premium map files from ImageKit
    try {
      const listRes = await fetch('https://api.imagekit.io/v1/files?tags=premium_map_config', {
        headers: { 'Authorization': authHeader },
        cache: 'no-store',
      });
      if (listRes.ok) {
        const files = await listRes.json();
        if (Array.isArray(files)) {
          for (const f of files) {
            await fetch(`https://api.imagekit.io/v1/files/${f.fileId}`, {
              method: 'DELETE',
              headers: { 'Authorization': authHeader },
            });
          }
        }
      }
    } catch (e) {
      console.warn('Purge premium map note:', e);
    }

    // 4. Upload updated premium map config file to ImageKit
    try {
      const formData = new FormData();
      const fileBlob = new Blob([JSON.stringify({ premiumMap })], { type: 'application/json' });
      formData.append('file', fileBlob, 'premium_map_config.json');
      formData.append('fileName', 'premium_map_config.json');
      formData.append('tags', 'premium_map_config');

      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('ImageKit upload returned status ' + uploadRes.status);
      }
    } catch (e: any) {
      console.error('Failed to upload premium map config:', e);
      return NextResponse.json({ success: false, error: 'Config upload failed: ' + e.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, isPremium, price: price || '$9.99' });
  } catch (err: any) {
    console.error('Failed to toggle premium status:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
