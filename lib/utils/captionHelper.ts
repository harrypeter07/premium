// Helper for generating & cleaning titles and captions for Smriti Shah Visual Portfolio

export const ELEGANT_INDIAN_MODEL_TITLES = [
  "Golden Hour Silk Tulle Editorial",
  "Sun-Kissed Terracotta & Warm Tones",
  "Cinematic Monsoon Vignettes",
  "Haute Couture Velvet & Gold Study",
  "Minimalist Satin Silhouette",
  "Ethereal Sunset Studio Captures",
  "Bespoke Royal Heritage Edit",
  "Candlelit Amber & Shadow Study",
  "Monochrome Film Aesthetic",
  "Parisian Promenade Couture Drop",
  "Sultry Summer Evening Series",
  "Architectural Lines & Fashion Framing",
];

export const ELEGANT_INDIAN_MODEL_CAPTIONS = [
  "Sun-drenched aesthetic study captured under soft studio lighting, showcasing natural elegance and bespoke tailoring.",
  "High-fashion editorial portrait highlighting rich textures, minimal composition, and warm golden tones.",
  "Atmospheric visual story from the private archive, blending traditional silhouettes with contemporary editorial aesthetics.",
  "Cinematic frame capturing raw emotion, subtle lighting contrast, and haute couture design elements.",
  "Behind-the-scenes aesthetic moment from the latest Paris & Mumbai editorial campaign.",
];

/**
 * Checks if a title is missing, blank, or looks like a raw computer generated filename
 * (e.g., "ChatGPT Image Jul 24, 2026", "IMG_20260724", "DSC_0012", etc.)
 * Returns either the clean user-supplied title or a stylish random caption.
 */
export function cleanOrGenerateTitle(rawTitle?: string): string {
  if (!rawTitle || !rawTitle.trim()) {
    return getRandomItem(ELEGANT_INDIAN_MODEL_TITLES);
  }

  const trimmed = rawTitle.trim();

  // Pattern matching for raw AI/Camera/System filenames
  const isRawFilenamePattern = /^(chatgpt|img_|dsc_|screenshot|photo_|image_|file_|[0-9\s_-]+$)/i.test(trimmed);

  if (isRawFilenamePattern) {
    return getRandomItem(ELEGANT_INDIAN_MODEL_TITLES);
  }

  return trimmed;
}

export function cleanOrGenerateDescription(rawDesc?: string): string {
  if (!rawDesc || !rawDesc.trim() || rawDesc.includes('High-resolution archive uploaded')) {
    return getRandomItem(ELEGANT_INDIAN_MODEL_CAPTIONS);
  }

  return rawDesc.trim();
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
