import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, path, fromPath, visitorId, device, browser, os, screen, referrer, duration, mediaId } = body;

    // Detect Geo headers from Vercel / Cloudflare headers
    const country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || 'India';
    const region = req.headers.get('x-vercel-ip-country-region') || 'Maharashtra';
    const city = req.headers.get('x-vercel-ip-city') || 'Mumbai';

    // Store in Supabase PostgreSQL Database via Prisma
    try {
      await db.analyticsEvent.create({
        data: {
          type: type || 'PAGE_VIEW',
          path: path || '/',
          fromPath: fromPath || null,
          referrer: referrer || null,
          visitorId: visitorId || 'fp-guest',
          country,
          region,
          city,
          device: device || 'Desktop',
          browser: browser || 'Chrome',
          os: os || 'Windows',
          screen: screen || '1920x1080',
          duration: duration ? Number(duration) : 15,
          mediaId: mediaId || null,
        },
      });
    } catch (prismaErr) {
      console.warn('[Analytics Ingest] Prisma fallback:', prismaErr);
    }

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (err) {
    console.error('Analytics tracking error:', err);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
