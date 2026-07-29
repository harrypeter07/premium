export type MediaType = 'IMAGE' | 'VIDEO';

export type CategorySlug = 
  | 'fashion'
  | 'lifestyle'
  | 'travel'
  | 'photography'
  | 'fitness'
  | 'behind-the-scenes'
  | 'beauty'
  | 'editorial'
  | 'daily-life'
  | 'exclusive'
  | 'trending';

export interface MultiResolutions {
  '1080p': string;
  '720p': string;
  '480p': string;
  '360p': string;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  price?: string;
  isFree: boolean;
  count?: number;
  createdAt?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string;
  blurDataUrl?: string;
  altText: string;
  width: number;
  height: number;
  duration?: number;
  resolutions?: MultiResolutions;
  
  views: number;
  likes: number;
  bookmarksCount: number;
  sharesCount: number;
  
  isFeatured?: boolean;
  isTrending?: boolean;
  isPinned?: boolean;
  visibility: 'PUBLIC' | 'PRIVATE' | 'DRAFT';
  publishedAt: string;
  
  category: {
    id: string;
    name: string;
    slug: string;
  };
  collectionId?: string;
  tags: string[];
  
  isPremium?: boolean;
  price?: string;
  
  affiliateProducts?: AffiliateProduct[];
}

export interface AffiliateProduct {
  id: string;
  title: string;
  brand: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
}

export interface CreatorProfile {
  name: string;
  handle: string;
  role: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  location: string;
  stats: {
    totalViews: string;
    totalFollowers: string;
    totalMedia: number;
    monthlyReach: string;
  };
  socials: {
    instagram: string;
    tiktok: string;
    youtube: string;
    pinterest: string;
    twitter: string;
  };
}

export interface AnalyticsSummary {
  realtimeVisitors: number;
  dailyVisitors: number;
  weeklyVisitors: number;
  monthlyVisitors: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: string;
  avgWatchTime: string;
  scrollDepth: number;
  pagesPerSession: number;
  
  adRevenue: {
    totalEarnings: number;
    rpm: number;
    ctr: number;
    cpc: number;
  };
  
  trafficSources: { source: string; percentage: number }[];
  topCountries: { country: string; flag: string; visitors: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  
  systemHealth: {
    cdnCacheHitRatio: number;
    apiLatencyMs: number;
    dbLatencyMs: number;
    redisHitRate: number;
    storageUsedGb: number;
    bandwidthUsedTb: number;
  };
}
