import { MediaItem } from './types';
import { MEDIA_ITEMS } from './data/mockData';

export interface UserSignals {
  recentCategorySlugs?: string[];
  recentTags?: string[];
  likedMediaIds?: string[];
  historyMediaIds?: string[];
}

export function getRecommendedFeed(
  allMedia: MediaItem[] = MEDIA_ITEMS,
  userSignals: UserSignals = {},
  limit = 20
): MediaItem[] {
  const {
    recentCategorySlugs = [],
    recentTags = [],
    likedMediaIds = [],
    historyMediaIds = [],
  } = userSignals;

  const maxViews = Math.max(...allMedia.map(m => m.views), 1);
  const maxLikes = Math.max(...allMedia.map(m => m.likes), 1);

  const scoredItems = allMedia.map(item => {
    let score = 0;

    // 1. Popularity & Engagement Score (0 - 30 pts)
    const viewScore = (item.views / maxViews) * 15;
    const likeScore = (item.likes / maxLikes) * 15;
    score += viewScore + likeScore;

    // 2. Trending & Featured Boost (0 - 20 pts)
    if (item.isTrending) score += 15;
    if (item.isFeatured) score += 10;

    // 3. Category Affinity Match (0 - 25 pts)
    if (recentCategorySlugs.includes(item.category.slug)) {
      score += 25;
    }

    // 4. Tag Match (0 - 20 pts)
    const matchingTags = item.tags.filter(t => recentTags.includes(t));
    score += Math.min(matchingTags.length * 7, 20);

    // 5. Penalize already watched items slightly to encourage fresh discovery (-10 pts)
    if (historyMediaIds.includes(item.id)) {
      score -= 10;
    }

    // 6. Random exploration factor (0 - 15 pts) for diversity
    const randomSerendipity = Math.random() * 15;
    score += randomSerendipity;

    return { item, score };
  });

  // Sort descending by score
  scoredItems.sort((a, b) => b.score - a.score);

  return scoredItems.slice(0, limit).map(s => s.item);
}
