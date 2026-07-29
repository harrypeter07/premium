import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { url, isPremium, price } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Media URL is required' }, { status: 400 });
    }

    const configRecord = await db.systemConfig.findUnique({
      where: { key: 'premium_map_config' },
    });

    let parsed = { premiumMap: {} as Record<string, string> };
    if (configRecord && configRecord.value) {
      parsed = JSON.parse(configRecord.value);
      if (!parsed.premiumMap) parsed.premiumMap = {};
    }

    if (isPremium) {
      parsed.premiumMap[url] = price || '$9.99';
    } else {
      if (parsed.premiumMap[url]) {
        delete parsed.premiumMap[url];
      }
    }

    await db.systemConfig.upsert({
      where: { key: 'premium_map_config' },
      update: { value: JSON.stringify(parsed) },
      create: {
        key: 'premium_map_config',
        value: JSON.stringify(parsed),
      },
    });

    return NextResponse.json({ success: true, isPremium, price: price || '$9.99' });
  } catch (err: any) {
    console.error('Failed to toggle premium status:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
