import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Dynamically execute SQL queries to add isPremium and price columns if they do not exist
    await db.$executeRawUnsafe(`
      ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN DEFAULT false;
    `);
    await db.$executeRawUnsafe(`
      ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "price" TEXT DEFAULT 'FREE';
    `);

    return NextResponse.json({ success: true, message: 'Database migrated successfully' });
  } catch (err: any) {
    console.error('Migration error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
