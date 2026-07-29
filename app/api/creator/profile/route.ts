import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_QEH6sevZJ316f5zVNCz8HGcWY8k=';
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    let coverUrl = '';
    let avatarUrl = '';

    // 1. Fetch cover image using standard tags filter
    try {
      const coverRes = await fetch('https://api.imagekit.io/v1/files?tags=creator_cover', {
        headers: { 'Authorization': authHeader },
        cache: 'no-store',
      });
      if (coverRes.ok) {
        const coverFiles = await coverRes.json();
        if (Array.isArray(coverFiles) && coverFiles.length > 0) {
          coverUrl = coverFiles[0].url;
        }
      }
    } catch (e) {
      console.warn('Cover fetch note:', e);
    }

    // 2. Fetch avatar image using standard tags filter
    try {
      const avatarRes = await fetch('https://api.imagekit.io/v1/files?tags=creator_avatar', {
        headers: { 'Authorization': authHeader },
        cache: 'no-store',
      });
      if (avatarRes.ok) {
        const avatarFiles = await avatarRes.json();
        if (Array.isArray(avatarFiles) && avatarFiles.length > 0) {
          avatarUrl = avatarFiles[0].url;
        }
      }
    } catch (e) {
      console.warn('Avatar fetch note:', e);
    }

    // 3. Fetch text profile from ImageKit config file for 100% reliability (bypassing Supabase IPv4 blocks)
    let profileData = {
      name: 'Smriti Shah',
      role: 'Haute Couture Model & Visual Storyteller',
      location: 'Mumbai · Paris · London',
      bio: 'Smriti Shah (@smriti.shans) is an international visual artist, fashion model, and storyteller. She curates high-resolution fine art imagery, editorial films, and exclusive behind-the-scenes archives.',
    };

    try {
      const configRes = await fetch('https://api.imagekit.io/v1/files?tags=profile_config', {
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
            profileData = {
              name: parsed.name || 'Smriti Shah',
              role: parsed.role || '',
              location: parsed.location || '',
              bio: parsed.bio || '',
            };
          }
        }
      }
    } catch (e) {
      console.warn('Failed to fetch profile config file:', e);
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...profileData,
        coverUrl,
        avatarUrl,
      },
    });
  } catch (err) {
    console.error('Creator profile GET error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch creator profile',
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, location, bio } = body;

    const payload = {
      name: name || 'Smriti Shah',
      role: role || '',
      location: location || '',
      bio: bio || '',
    };

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_QEH6sevZJ316f5zVNCz8HGcWY8k=';
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    // 1. Purge old config files with tag profile_config
    try {
      const listRes = await fetch('https://api.imagekit.io/v1/files?tags=profile_config', {
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
      console.warn('Profile config purge note:', e);
    }

    // 2. Upload new config file to ImageKit
    try {
      const formData = new FormData();
      const fileBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      formData.append('file', fileBlob, 'profile_config.json');
      formData.append('fileName', 'profile_config.json');
      formData.append('tags', 'profile_config');

      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('ImageKit upload returned status ' + uploadRes.status);
      }
    } catch (e) {
      console.error('Failed to upload profile config:', e);
      return NextResponse.json({ success: false, error: 'Config upload failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profile: payload,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to update profile' }, { status: 400 });
  }
}
