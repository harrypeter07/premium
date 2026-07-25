import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Log or aggregate event in Redis / PostgreSQL DB
    console.log('[Analytics Telemetry Ingested]:', body.type, body.path);
    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
