import { MultiResolutions } from '../types';

export function getCloudflareImageUrl(
  originalUrl: string,
  width: number,
  quality = 80,
  format: 'auto' | 'webp' | 'avif' = 'auto'
): string {
  if (!originalUrl) return '';
  if (originalUrl.includes('unsplash.com')) {
    return `${originalUrl.split('?')[0]}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }
  if (originalUrl.includes('ik.imagekit.io')) {
    const baseUrl = originalUrl.split('?')[0];
    return `${baseUrl}?tr=pr-true,w-${width},q-${quality},f-auto`;
  }
  const cfDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || 'https://pub-cloudflare-r2.r2.dev';
  if (originalUrl.startsWith(cfDomain)) {
    return `${cfDomain}/cdn-cgi/image/width=${width},quality=${quality},format=${format}/${originalUrl.replace(cfDomain + '/', '')}`;
  }
  return originalUrl;
}

export function generateMultiResolutions(baseVideoUrl: string): MultiResolutions {
  if (baseVideoUrl.includes('mixkit.co')) {
    return {
      '1080p': baseVideoUrl.replace('-small', '-large').replace('-medium', '-large'),
      '720p': baseVideoUrl.replace('-large', '-medium').replace('-small', '-medium'),
      '480p': baseVideoUrl.replace('-large', '-small').replace('-medium', '-small'),
      '360p': baseVideoUrl.replace('-large', '-small').replace('-medium', '-small'),
    };
  }
  return {
    '1080p': `${baseVideoUrl}#1080p`,
    '720p': `${baseVideoUrl}#720p`,
    '480p': `${baseVideoUrl}#480p`,
    '360p': `${baseVideoUrl}#360p`,
  };
}

export async function simulateUploadToR2(
  fileName: string,
  fileType: 'IMAGE' | 'VIDEO',
  fileBuffer: ArrayBuffer
): Promise<{ url: string; thumbnailUrl: string; resolutions?: MultiResolutions }> {
  const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || 'https://pub-cloudflare-r2.r2.dev';
  const timestamp = Date.now();
  const cleanName = fileName.toLowerCase().replace(/[^a-z0-9.]/g, '-');
  
  if (fileType === 'IMAGE') {
    const url = `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80`;
    return {
      url,
      thumbnailUrl: getCloudflareImageUrl(url, 800),
    };
  } else {
    const videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-a-runway-41279-large.mp4';
    return {
      url: videoUrl,
      thumbnailUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      resolutions: generateMultiResolutions(videoUrl),
    };
  }
}
