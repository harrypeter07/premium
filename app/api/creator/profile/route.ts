import { NextResponse } from 'next/server';

let memoryProfileText = {
  name: 'Smriti Shah',
  role: 'Haute Couture Model & Visual Storyteller',
  location: 'Mumbai · Paris · London',
  bio: 'Smriti Shah (@smriti.shans) is an international visual artist, fashion model, and storyteller. She curates high-resolution fine art imagery, editorial films, and exclusive behind-the-scenes archives.',
};

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_QEH6sevZJ316f5zVNCz8HGcWY8k=';
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    let coverUrl = '';
    let avatarUrl = '';

    // Dynamically fetch tagged creator_cover file from ImageKit
    try {
      const coverRes = await fetch(`https://api.imagekit.io/v1/files?searchQuery=tags IN ("creator_cover")`, {
        headers: { 'Authorization': authHeader },
        cache: 'no-store',
      });
      if (coverRes.ok) {
        const coverFiles = await coverRes.json();
        if (Array.isArray(coverFiles) && coverFiles.length > 0) {
          coverUrl = coverFiles[0].url;
        }
      }
    } catch (e) {}

    // Dynamically fetch tagged creator_avatar file from ImageKit
    try {
      const avatarRes = await fetch(`https://api.imagekit.io/v1/files?searchQuery=tags IN ("creator_avatar")`, {
        headers: { 'Authorization': authHeader },
        cache: 'no-store',
      });
      if (avatarRes.ok) {
        const avatarFiles = await avatarRes.json();
        if (Array.isArray(avatarFiles) && avatarFiles.length > 0) {
          avatarUrl = avatarFiles[0].url;
        }
      }
    } catch (e) {}

    // Fallback: If no tags set yet, query top recent uploaded files from ImageKit
    if (!coverUrl || !avatarUrl) {
      try {
        const allRes = await fetch(`https://api.imagekit.io/v1/files?limit=10`, {
          headers: { 'Authorization': authHeader },
          cache: 'no-store',
        });
        if (allRes.ok) {
          const allFiles = await allRes.json();
          if (Array.isArray(allFiles) && allFiles.length > 0) {
            if (!coverUrl && allFiles[0]) coverUrl = allFiles[0].url;
            if (!avatarUrl && allFiles[1]) avatarUrl = allFiles[1].url;
          }
        }
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...memoryProfileText,
        coverUrl,
        avatarUrl,
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
    return NextResponse.json({ success: true, profile: memoryProfileText });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 400 });
  }
}
