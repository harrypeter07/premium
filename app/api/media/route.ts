import { NextResponse } from 'next/server';
import { MEDIA_ITEMS } from '@/lib/data/mockData';
import { MediaItem } from '@/lib/types';

// In-memory dynamic store combining uploaded assets with mock items
let dynamicMediaStore: MediaItem[] = [...MEDIA_ITEMS];

export async function GET() {
  return NextResponse.json({ media: dynamicMediaStore, count: dynamicMediaStore.length });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, type, url, thumbnailUrl, categorySlug, tags, visibility, isFeatured, isPinned } = body;

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    const newMediaItem: MediaItem = {
      id: `upload-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || 'High-resolution archive uploaded via Studio Admin Panel.',
      type: type || 'IMAGE',
      url,
      thumbnailUrl: thumbnailUrl || url,
      altText: title,
      width: 1200,
      height: 1600,
      views: 1,
      likes: 0,
      bookmarksCount: 0,
      sharesCount: 0,
      isFeatured: Boolean(isFeatured),
      isTrending: false,
      isPinned: Boolean(isPinned),
      visibility: visibility || 'PUBLIC',
      publishedAt: new Date().toISOString(),
      category: {
        id: `cat-${categorySlug || 'fashion'}`,
        name: categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Fashion',
        slug: categorySlug || 'fashion',
      },
      tags: tags || ['StudioUpload', 'SmritiShah'],
    };

    // Unpin other items if this new upload is pinned
    if (newMediaItem.isPinned) {
      dynamicMediaStore = dynamicMediaStore.map(item => ({ ...item, isPinned: false }));
    }

    dynamicMediaStore.unshift(newMediaItem);

    return NextResponse.json({ success: true, media: newMediaItem });
  } catch (err) {
    console.error('Error saving media:', err);
    return NextResponse.json({ error: 'Failed to save media upload' }, { status: 500 });
  }
}
