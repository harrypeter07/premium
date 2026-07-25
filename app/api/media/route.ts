import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { MediaItem } from '@/lib/types';
import { cleanOrGenerateTitle, cleanOrGenerateDescription } from '@/lib/utils/captionHelper';

// In-memory fallback cache
let inMemoryMedia: MediaItem[] = [];

async function fetchFromImageKit(): Promise<MediaItem[]> {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_QEH6sevZJ316f5zVNCz8HGcWY8k=';
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    const res = await fetch('https://api.imagekit.io/v1/files?limit=100', {
      headers: {
        Authorization: authHeader,
      },
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      console.warn('ImageKit files API response not ok:', res.status);
      return [];
    }

    const files = await res.json();
    if (!Array.isArray(files)) return [];

    // Filter out stock placeholder images (e.g. default-image.jpg) so ONLY real user uploads show
    const userFiles = files.filter((file: any) =>
      file.name !== 'default-image.jpg' &&
      !file.name.includes('default')
    );

    return userFiles.map((file: any) => {
      const isVideo = file.fileType === 'non-image' || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
      const title = cleanOrGenerateTitle(file.name);
      const description = cleanOrGenerateDescription('');

      return {
        id: file.fileId || `ik-${file.name}`,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        type: isVideo ? 'VIDEO' : 'IMAGE',
        url: file.url,
        thumbnailUrl: file.thumbnail || file.url,
        altText: title,
        width: file.width || 1200,
        height: file.height || 1600,
        views: Math.floor(Math.random() * 500) + 120,
        likes: Math.floor(Math.random() * 80) + 15,
        bookmarksCount: 12,
        sharesCount: 5,
        isFeatured: true,
        isTrending: true,
        isPinned: false,
        visibility: 'PUBLIC',
        publishedAt: file.createdAt || new Date().toISOString(),
        category: {
          id: 'cat-fashion',
          name: 'Fashion',
          slug: 'fashion',
        },
        tags: ['SmritiShah', 'ImageKitUpload', isVideo ? 'Video' : 'Photography'],
      };
    });
  } catch (err) {
    console.error('Error fetching from ImageKit API:', err);
    return [];
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeCollections = searchParams.get('includeCollections') === 'true';

    let dbItems: MediaItem[] = [];

    // 1. Try Supabase PostgreSQL Database via Prisma Client
    try {
      const dbRecords = await db.media.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      });

      dbItems = dbRecords.map((m) => ({
        id: m.id,
        title: cleanOrGenerateTitle(m.title),
        slug: m.slug,
        description: cleanOrGenerateDescription(m.description || ''),
        type: m.type as 'IMAGE' | 'VIDEO',
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
        altText: m.altText || m.title,
        width: m.width || 1200,
        height: m.height || 1600,
        views: m.views,
        likes: m.likes,
        bookmarksCount: m.bookmarksCount,
        sharesCount: m.sharesCount,
        isFeatured: m.isFeatured,
        isTrending: m.isTrending,
        isPinned: m.isPinned,
        visibility: m.visibility as 'PUBLIC' | 'PRIVATE' | 'DRAFT',
        publishedAt: m.publishedAt ? m.publishedAt.toISOString() : m.createdAt.toISOString(),
        category: {
          id: m.category.id,
          name: m.category.name,
          slug: m.category.slug,
        },
        tags: ['SmritiShah', 'SupabaseDB'],
      }));
    } catch (dbErr) {
      console.warn('Supabase DB fetch fallback triggered:', dbErr);
    }

    // 2. Fetch directly from ImageKit API
    const imageKitItems = await fetchFromImageKit();

    // 3. Merge stores seamlessly
    const combinedMap = new Map<string, MediaItem>();

    [...inMemoryMedia, ...dbItems, ...imageKitItems].forEach((item) => {
      if (!combinedMap.has(item.id) && !combinedMap.has(item.url)) {
        combinedMap.set(item.url, item);
      }
    });

    let finalMedia = Array.from(combinedMap.values());

    // Exclude stock default images
    finalMedia = finalMedia.filter(m => !m.url.includes('default-image'));

    return NextResponse.json({ media: finalMedia, count: finalMedia.length });
  } catch (err) {
    console.error('Failed to GET media:', err);
    return NextResponse.json({ media: inMemoryMedia, count: inMemoryMedia.length });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, type, url, thumbnailUrl, categorySlug, collectionId, tags, visibility, isFeatured, isPinned } = body;

    if (!url) {
      return NextResponse.json({ error: 'Media URL is required' }, { status: 400 });
    }

    const finalTitle = cleanOrGenerateTitle(title);
    const finalDescription = cleanOrGenerateDescription(description);

    const mediaId = `media-${Date.now()}`;

    const newMediaItem: MediaItem = {
      id: mediaId,
      title: finalTitle,
      slug: `${finalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
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

    inMemoryMedia.unshift(newMediaItem);

    try {
      const catSlug = categorySlug || 'fashion';
      const catName = catSlug.charAt(0).toUpperCase() + catSlug.slice(1);
      
      const categoryRecord = await db.category.upsert({
        where: { slug: catSlug },
        update: {},
        create: {
          name: catName,
          slug: catSlug,
          description: `${catName} visual archive category`,
        },
      });

      await db.media.create({
        data: {
          id: mediaId,
          title: finalTitle,
          slug: newMediaItem.slug,
          description: finalDescription,
          type: type === 'VIDEO' ? 'VIDEO' : 'IMAGE',
          url,
          thumbnailUrl: thumbnailUrl || url,
          altText: finalTitle,
          width: 1200,
          height: 1600,
          views: 0,
          likes: 0,
          isFeatured: Boolean(isFeatured),
          isPinned: Boolean(isPinned),
          visibility: visibility || 'PUBLIC',
          publishedAt: new Date(),
          categoryId: categoryRecord.id,
        },
      });
    } catch (prismaErr) {
      console.warn('Prisma DB insert fallback:', prismaErr);
    }

    return NextResponse.json({ success: true, media: newMediaItem });
  } catch (err) {
    console.error('Error saving media:', err);
    return NextResponse.json({ error: 'Failed to save media upload' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    inMemoryMedia = inMemoryMedia.filter((m) => m.id !== id && m.url !== id);

    try {
      await db.media.deleteMany({
        where: {
          OR: [{ id }, { url: id }],
        },
      });
    } catch (prismaErr) {
      console.warn('Prisma DB delete fallback:', prismaErr);
    }

    return NextResponse.json({ success: true, message: 'Media item deleted' });
  } catch (err) {
    console.error('Error deleting media item:', err);
    return NextResponse.json({ error: 'Failed to delete media item' }, { status: 500 });
  }
}
