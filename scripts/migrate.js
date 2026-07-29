const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB migration...');
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN DEFAULT false;
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Media" ADD COLUMN IF NOT EXISTS "price" TEXT DEFAULT 'FREE';
    `);
    console.log('✅ DB migrated successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
