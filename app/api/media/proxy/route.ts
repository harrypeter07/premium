import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const rawUrl = searchParams.get('url');

    if (!key && !rawUrl) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }

    let targetUrl = '';
    if (key) {
      try {
        // Decode base64 to mask original filenames in the networks tab query parameters
        targetUrl = Buffer.from(key, 'base64').toString('utf-8');
      } catch (decodeErr) {
        return new NextResponse('Invalid encoding key', { status: 400 });
      }
    } else if (rawUrl) {
      targetUrl = decodeURIComponent(rawUrl);
    }

    // Security check: Only allow proxying from verified media store (ImageKit)
    if (!targetUrl.includes('ik.imagekit.io')) {
      return new NextResponse('Forbidden domain mapping', { status: 403 });
    }

    // Server-side fetch from storage
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return new NextResponse('Failed to retrieve storage file', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    // Serve with client-side caching to prevent latency
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image proxy handler error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
