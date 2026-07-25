import { NextResponse } from 'next/server';
import { MediaItem } from '@/lib/types';
import { cleanOrGenerateTitle, cleanOrGenerateDescription } from '@/lib/utils/captionHelper';

// In-memory dynamic store starts completely empty (zero placeholders)
let dynamicMediaStore: MediaItem[] = [];

export async function GET() {
  return NextResponse.json({ media: dynamicMediaStore, count: dynamicMediaStore.length });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, type, url, thumbnailUrl, categorySlug, collectionId, tags, visibility, isFeatured, isPinned } = body;

    if (!url) {
      return NextResponse.json({ error: 'Media URL is required' }, { status: 400 });
    }

    // Clean title & description or fallback to stylish natural captions if raw/blank
    const finalTitle = cleanOrGenerateTitle(title);
    const finalDescription = cleanOrGenerateDescription(description);

    const newMediaItem: MediaItem = {
      id: `upload-${Date.now()}`,
      title: finalTitle,
      slug: finalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: finalDescription,
      type: type || 'IMAGE',
      url,
      thumbnailUrl: thumbnailUrl || url,
      altText: finalTitle,
      width: 1200,
      height: 1600,
      views: 0,
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
      collectionId: collectionId || undefined,
      tags: tags || ['SmritiShah', 'Editorial'],
    };

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
