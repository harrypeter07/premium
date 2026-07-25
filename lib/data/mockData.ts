import { MediaItem, CreatorProfile, AnalyticsSummary } from '../types';

export const CREATOR_PROFILE: CreatorProfile = {
  name: 'Smriti Shah',
  handle: '@smriti.shans',
  role: 'International Model & Creative Director',
  bio: 'Visual storyteller curating high-fashion editorials, architectural photography, cinematic travel films, and haute couture archives across Mumbai, Paris, and London.',
  avatarUrl: 'https://ik.imagekit.io/epe7dzmjg/tr:w-300,h-300/default-avatar.jpg',
  coverUrl: 'https://ik.imagekit.io/epe7dzmjg/tr:w-1200/default-cover.jpg',
  location: 'Mumbai & Paris',
  stats: {
    totalViews: '0',
    totalFollowers: '0',
    totalMedia: 0,
    monthlyReach: '0',
  },
  socials: {
    instagram: 'https://instagram.com/smriti.shans',
    tiktok: 'https://tiktok.com/@smriti.shans',
    youtube: 'https://youtube.com/@smritishah',
    pinterest: 'https://pinterest.com/smritishah',
    twitter: 'https://x.com/smritishans',
  },
};

export const CATEGORIES_LIST = [
  { id: 'cat-1', name: 'Fashion', slug: 'fashion', description: 'Haute couture, runway highlights, and seasonal style drops.', coverImage: 'https://ik.imagekit.io/epe7dzmjg/fashion.jpg', count: 0 },
  { id: 'cat-2', name: 'Lifestyle', slug: 'lifestyle', description: 'Luxury living, interior design, and curated aesthetics.', coverImage: 'https://ik.imagekit.io/epe7dzmjg/lifestyle.jpg', count: 0 },
  { id: 'cat-3', name: 'Travel', slug: 'travel', description: 'Wanderlust diaries, exotic resorts, and hidden gems.', coverImage: 'https://ik.imagekit.io/epe7dzmjg/travel.jpg', count: 0 },
  { id: 'cat-4', name: 'Photography', slug: 'photography', description: '35mm film captures, portrait studies, and landscape compositions.', coverImage: 'https://ik.imagekit.io/epe7dzmjg/photography.jpg', count: 0 },
];

// Empty media store - Remove all Unsplash placeholder images. Show only actual user uploaded items!
export const MEDIA_ITEMS: MediaItem[] = [];

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  realtimeVisitors: 0,
  dailyVisitors: 0,
  weeklyVisitors: 0,
  monthlyVisitors: 0,
  sessions: 0,
  bounceRate: 0,
  avgSessionDuration: '0s',
  avgWatchTime: '0s',
  scrollDepth: 0,
  pagesPerSession: 0,

  adRevenue: {
    totalEarnings: 0,
    rpm: 0,
    ctr: 0,
    cpc: 0,
  },

  trafficSources: [],

  topCountries: [],

  deviceBreakdown: [],

  systemHealth: {
    cdnCacheHitRatio: 100,
    apiLatencyMs: 0,
    dbLatencyMs: 0,
    redisHitRate: 100,
    storageUsedGb: 0,
    bandwidthUsedTb: 0,
  },
};
