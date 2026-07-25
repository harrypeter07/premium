import { NextResponse } from 'next/server';
import { CollectionItem } from '@/lib/types';

// Dynamic store starts completely empty (zero mock placeholders/images)
let collectionsStore: CollectionItem[] = [];

export async function GET() {
  return NextResponse.json({ collections: collectionsStore });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, coverImage, price, isFree } = body;

    if (!name || !coverImage) {
      return NextResponse.json({ error: 'Collection name and cover image URL are required' }, { status: 400 });
    }

    const newCollection: CollectionItem = {
      id: `col-${Date.now()}`,
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description?.trim() || 'Curated visual collection folder.',
      coverImage: coverImage.trim(),
      price: isFree ? 'FREE' : (price?.trim() || '$4.99'),
      isFree: Boolean(isFree),
      count: 0,
      createdAt: new Date().toISOString(),
    };

    collectionsStore.unshift(newCollection);

    return NextResponse.json({ success: true, collection: newCollection });
  } catch (err) {
    console.error('Failed to create collection:', err);
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
    }

    collectionsStore = collectionsStore.filter(c => c.id !== id);
    return NextResponse.json({ success: true, collections: collectionsStore });
  } catch {
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}
