import { CollectionItem } from '@/lib/types';

export interface CommentItem {
  id: string;
  mediaId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export function getSavedBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('smr_bookmarks');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleBookmarkStorage(mediaId: string): boolean {
  if (typeof window === 'undefined') return false;
  const list = getSavedBookmarks();
  const index = list.indexOf(mediaId);
  let isSaved = false;

  if (index > -1) {
    list.splice(index, 1);
    isSaved = false;
  } else {
    list.push(mediaId);
    isSaved = true;
  }

  localStorage.setItem('smr_bookmarks', JSON.stringify(list));
  window.dispatchEvent(new Event('smr_bookmarks_updated'));
  return isSaved;
}

export function getSavedLikes(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('smr_likes');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleLikeStorage(mediaId: string): boolean {
  if (typeof window === 'undefined') return false;
  const list = getSavedLikes();
  const index = list.indexOf(mediaId);
  let isLiked = false;

  if (index > -1) {
    list.splice(index, 1);
    isLiked = false;
  } else {
    list.push(mediaId);
    isLiked = true;
  }

  localStorage.setItem('smr_likes', JSON.stringify(list));
  window.dispatchEvent(new Event('smr_likes_updated'));
  return isLiked;
}

export function getWatchHistory(): { mediaId: string; timestamp: number }[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('smr_history');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToWatchHistory(mediaId: string) {
  if (typeof window === 'undefined') return;
  const history = getWatchHistory().filter(item => item.mediaId !== mediaId);
  history.unshift({ mediaId, timestamp: Date.now() });
  localStorage.setItem('smr_history', JSON.stringify(history.slice(0, 50)));
  window.dispatchEvent(new Event('smr_history_updated'));
}

export function clearWatchHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('smr_history');
  window.dispatchEvent(new Event('smr_history_updated'));
}

export function getCommentsForMedia(mediaId: string): CommentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(`smr_comments_${mediaId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addCommentForMedia(mediaId: string, userName: string, text: string): CommentItem {
  const comments = getCommentsForMedia(mediaId);
  const newComment: CommentItem = {
    id: `comm-${Date.now()}`,
    mediaId,
    userName: userName.trim() || 'Visual Connoisseur',
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };
  comments.unshift(newComment);
  localStorage.setItem(`smr_comments_${mediaId}`, JSON.stringify(comments));
  return newComment;
}

export function getRatingForMedia(mediaId: string): number {
  if (typeof window === 'undefined') return 5;
  try {
    const data = localStorage.getItem(`smr_rating_${mediaId}`);
    return data ? Number(data) : 5;
  } catch {
    return 5;
  }
}

export function setRatingForMedia(mediaId: string, rating: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`smr_rating_${mediaId}`, String(rating));
}

// Persistent Uploaded Media Storage
export function getPersistentUploadedMedia(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('smr_uploaded_media');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePersistentUploadedMedia(items: any[]) {
  if (typeof window === 'undefined') return;
  const current = getPersistentUploadedMedia();
  const merged = [...items, ...current.filter(c => !items.some(i => i.id === c.id))];
  localStorage.setItem('smr_uploaded_media', JSON.stringify(merged));
}

// Persistent Collections Storage
export function getPersistentCollections(): CollectionItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('smr_collections');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePersistentCollections(collections: CollectionItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('smr_collections', JSON.stringify(collections));
}
