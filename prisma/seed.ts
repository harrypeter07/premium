import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Supabase PostgreSQL database...');

  // Seed Admin User into Supabase DB
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@smriti.com' },
    update: {
      password: 'wrongpassword',
      role: Role.ADMIN,
      name: 'Smriti Shah Admin',
    },
    create: {
      email: 'admin@smriti.com',
      password: 'wrongpassword',
      name: 'Smriti Shah Admin',
      role: Role.ADMIN,
    },
  });

  console.log('Admin user seeded successfully:', adminUser.email);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
