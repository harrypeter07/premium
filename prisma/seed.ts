import { PrismaClient } from '@prisma/client';
import { MEDIA_ITEMS, CATEGORIES_LIST } from '../lib/data/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial categories and media items...');

  for (const cat of CATEGORIES_LIST) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, coverImage: cat.coverImage },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        coverImage: cat.coverImage,
      },
    });
  }

  for (const m of MEDIA_ITEMS) {
    await prisma.media.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        id: m.id,
        title: m.title,
        slug: m.slug,
        description: m.description,
        type: m.type,
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
        altText: m.altText,
        width: m.width,
        height: m.height,
        duration: m.duration,
        resolutions: m.resolutions ? JSON.stringify(m.resolutions) : undefined,
        views: m.views,
        likes: m.likes,
        bookmarksCount: m.bookmarksCount,
        sharesCount: m.sharesCount,
        isFeatured: m.isFeatured || false,
        isTrending: m.isTrending || false,
        isPinned: m.isPinned || false,
        visibility: m.visibility,
        publishedAt: new Date(m.publishedAt),
        categoryId: m.category.id,
      },
    });
  }

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
