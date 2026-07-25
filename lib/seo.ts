import { MediaItem, CreatorProfile } from './types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elena-vance.vercel.app';

export function generatePersonJsonLd(profile: CreatorProfile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.handle,
    description: profile.bio,
    image: profile.avatarUrl,
    jobTitle: profile.role,
    sameAs: [
      profile.socials.instagram,
      profile.socials.tiktok,
      profile.socials.youtube,
      profile.socials.pinterest,
      profile.socials.twitter,
    ],
  };
}

export function generateMediaJsonLd(media: MediaItem) {
  if (media.type === 'VIDEO') {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: media.title,
      description: media.description,
      thumbnailUrl: [media.thumbnailUrl],
      uploadDate: media.publishedAt,
      duration: media.duration ? `PT${Math.round(media.duration)}S` : 'PT30S',
      contentUrl: media.url,
      embedUrl: `${SITE_URL}/media/${media.id}`,
      interactionStatistic: [
        {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'WatchAction' },
          userInteractionCount: media.views,
        },
        {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'LikeAction' },
          userInteractionCount: media.likes,
        },
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: media.title,
    description: media.description,
    contentUrl: media.url,
    thumbnailUrl: media.thumbnailUrl,
    datePublished: media.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Elena Vance',
    },
  };
}
