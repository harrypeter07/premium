import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // 1. Create SystemConfig table if it doesn't exist in Supabase
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SystemConfig" (
          "key" TEXT NOT NULL,
          "value" TEXT NOT NULL,
          CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("key")
      );
    `);

    // 2. Add isPremium and price columns to Media table if they do not exist
    await db.$executeRawUnsafe(`
      ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN DEFAULT false;
    `);
    await db.$executeRawUnsafe(`
      ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "price" TEXT DEFAULT 'FREE';
    `);

    return NextResponse.json({ success: true, message: 'Database schema migrated successfully' });
  } catch (err: any) {
    console.error('Migration error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
