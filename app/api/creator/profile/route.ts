import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

let memoryProfileText = {
  name: 'Smriti Shah',
  role: 'Haute Couture Model & Visual Storyteller',
  location: 'Mumbai · Paris · London',
  bio: 'Smriti Shah (@smriti.shans) is an international visual artist, fashion model, and storyteller. She curates high-resolution fine art imagery, editorial films, and exclusive behind-the-scenes archives.',
  coverUrl: 'https://ik.imagekit.io/epe7dzmjg/smr-portfolio/ChatGPT_Image_Jul_6__2026__04_18_46_AM_ymWxAKXY7.png?updatedAt=1785319456226',
  avatarUrl: 'https://ik.imagekit.io/epe7dzmjg/smr-portfolio/ChatGPT_Image_Jun_2__2026__05_06_57_PM_GqOx_TQBy.png?updatedAt=1785319463919',
};

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

    // 3. Try to read text profile from database SystemConfig
    try {
      const configRecord = await db.systemConfig.findUnique({
        where: { key: 'smr_creator_profile' },
      });
      if (configRecord) {
        const parsed = JSON.parse(configRecord.value);
        memoryProfileText = { ...memoryProfileText, ...parsed };
      }
    } catch (dbErr) {
      console.warn('DB fetch fallback for profile text:', dbErr);
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...memoryProfileText,
        coverUrl: coverUrl || memoryProfileText.coverUrl,
        avatarUrl: avatarUrl || memoryProfileText.avatarUrl,
      },
    });
  } catch (err) {
    console.error('Creator profile GET error:', err);
    return NextResponse.json({
      success: true,
      profile: memoryProfileText,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    memoryProfileText = {
      ...memoryProfileText,
      ...body,
    };

    // Save text profile to database SystemConfig for permanent persistence
    try {
      await db.systemConfig.upsert({
        where: { key: 'smr_creator_profile' },
        update: { value: JSON.stringify(body) },
        create: {
          key: 'smr_creator_profile',
          value: JSON.stringify(body),
        },
      });
    } catch (dbErr) {
      console.warn('DB save fallback for profile text:', dbErr);
    }

    return NextResponse.json({ success: true, profile: memoryProfileText });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 400 });
  }
}
