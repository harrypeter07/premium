import { NextResponse } from 'next/server';

let globalCreatorProfile = {
  name: 'Smriti Shah',
  role: 'Haute Couture Model & Visual Storyteller',
  location: 'Mumbai · Paris · London',
  bio: 'Smriti Shah (@smriti.shans) is an international visual artist, fashion model, and storyteller. She curates high-resolution fine art imagery, editorial films, and exclusive behind-the-scenes archives.',
  coverUrl: 'https://ik.imagekit.io/epe7dzmjg/smr-portfolio/ChatGPT_Image_Jul_6__2026__04_18_46_AM_ymWxAKXY7.png?updatedAt=1785319456226',
  avatarUrl: 'https://ik.imagekit.io/epe7dzmjg/smr-portfolio/ChatGPT_Image_Jun_2__2026__05_06_57_PM_GqOx_TQBy.png?updatedAt=1785319463919',
};

export async function GET() {
  return NextResponse.json({ success: true, profile: globalCreatorProfile });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    globalCreatorProfile = {
      ...globalCreatorProfile,
      ...body,
    };
    return NextResponse.json({ success: true, profile: globalCreatorProfile });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 400 });
  }
}
