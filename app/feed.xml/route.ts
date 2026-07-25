import { NextResponse } from 'next/server';
import { MEDIA_ITEMS } from '@/lib/data/mockData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elena-vance.vercel.app';

export async function GET() {
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Elena Vance | Visual Archives RSS Feed</title>
    <link>${SITE_URL}</link>
    <description>High-resolution imagery, editorial video cuts, and minimal aesthetics by Elena Vance.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${MEDIA_ITEMS.map((item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${SITE_URL}/media/${item.id}</link>
      <guid>${SITE_URL}/media/${item.id}</guid>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <category>${item.category.name}</category>
    </item>
    `).join('')}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
