import { NextResponse } from 'next/server';
import { CollectionItem } from '@/lib/types';

// Default initial collections/folders for occasions and packs
let collectionsStore: CollectionItem[] = [
  {
    id: 'col-1',
    name: 'Haute Couture Runway',
    slug: 'haute-couture-runway',
    description: 'Exclusive Paris & Mumbai runway highlights and behind-the-scenes fitting moments.',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    price: 'FREE',
    isFree: true,
    count: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'col-2',
    name: 'Monsoon Studio Series',
    slug: 'monsoon-studio-series',
    description: 'Warm terracotta, silk drapes, and candlelit portrait studies.',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    price: 'FREE',
    isFree: true,
    count: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'col-3',
    name: 'VIP Private Archives',
    slug: 'vip-private-archives',
    description: 'Unfiltered 4K video reels, high-res portrait packs, and exclusive collector edits.',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    price: '$9.99 / VIP Pass',
    isFree: false,
    count: 24,
    createdAt: new Date().toISOString(),
  },
];

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
