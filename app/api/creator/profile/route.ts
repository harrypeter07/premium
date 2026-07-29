import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    // 3. Fetch text profile from database
    let profileData = {
      name: 'Smriti Shah',
      role: 'Haute Couture Model & Visual Storyteller',
      location: 'Mumbai · Paris · London',
      bio: 'Smriti Shah (@smriti.shans) is an international visual artist, fashion model, and storyteller. She curates high-resolution fine art imagery, editorial films, and exclusive behind-the-scenes archives.',
    };

    try {
      const configRecord = await db.category.findUnique({
        where: { slug: 'creator-profile-config' },
      });
      if (configRecord && configRecord.description) {
        const parsed = JSON.parse(configRecord.description);
        profileData = {
          name: parsed.name || 'Smriti Shah',
          role: parsed.role || '',
          location: parsed.location || '',
          bio: parsed.bio || '',
        };
      }
    } catch (dbErr) {
      console.warn('DB fetch error for profile text:', dbErr);
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

    const payload = JSON.stringify({
      name: name || 'Smriti Shah',
      role: role || '',
      location: location || '',
      bio: bio || '',
    });

    try {
      await db.category.upsert({
        where: { slug: 'creator-profile-config' },
        update: {
          description: payload,
        },
        create: {
          name: 'Creator Profile Config System Record',
          slug: 'creator-profile-config',
          description: payload,
        },
      });
    } catch (dbErr) {
      console.warn('DB save error for profile text:', dbErr);
    }

    return NextResponse.json({
      success: true,
      profile: {
        name: name || 'Smriti Shah',
        role: role || '',
        location: location || '',
        bio: bio || '',
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 400 });
  }
}
