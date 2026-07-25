import { NextResponse } from 'next/server';

export async function GET() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-4236633699270444';
  const rawId = pubId.replace('ca-', '');

  const content = `google.com, ${rawId}, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
