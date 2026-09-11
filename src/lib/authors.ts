import authorsMappingRaw from '../../content/authors.json';

// Supported image extensions
const IMAGE_EXT_REGEX = /\.(jpe?g|png|webp|avif|svg)$/i;

function normalizeUrl(filenameOrUrl: string): string {
  if (
    filenameOrUrl.startsWith('/') ||
    filenameOrUrl.startsWith('http://') ||
    filenameOrUrl.startsWith('https://')
  ) {
    return filenameOrUrl;
  }
  return `/peoples/${filenameOrUrl.replace(/^\/+/, '')}`;
}

// Build bidirectional normalized mapping table
const authorToAvatarMap: Record<string, string> = {};

const raw = authorsMappingRaw as Record<string, string>;

for (const [key, val] of Object.entries(raw)) {
  if (!key || !val) continue;

  const keyTrimmed = key.trim();
  const valTrimmed = val.trim();

  // Pattern A: "akshat-dwivedi.jpg": "Akshat Dwivedi"
  if (IMAGE_EXT_REGEX.test(keyTrimmed)) {
    authorToAvatarMap[valTrimmed.toLowerCase()] = normalizeUrl(keyTrimmed);
  }
  // Pattern B: "Akshat Dwivedi": "akshat-dwivedi.jpg"
  else if (IMAGE_EXT_REGEX.test(valTrimmed)) {
    authorToAvatarMap[keyTrimmed.toLowerCase()] = normalizeUrl(valTrimmed);
  }
  // Fallback: direct name to URL
  else {
    authorToAvatarMap[keyTrimmed.toLowerCase()] = normalizeUrl(valTrimmed);
  }
}

/**
 * Returns the mapped profile avatar URL for an author name,
 * with automatic fallback to slugified name in /peoples/.
 */
export function getAuthorAvatar(authorName?: string): string | null {
  if (!authorName) return null;

  const trimmed = authorName.trim();
  const lower = trimmed.toLowerCase();

  // Direct match
  if (authorToAvatarMap[lower]) {
    return authorToAvatarMap[lower];
  }

  // Automatic slug match: e.g. "Akshat Dwivedi" -> slug "akshat-dwivedi"
  const slug = lower.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  if (slug) {
    for (const [mappedName, avatarUrl] of Object.entries(authorToAvatarMap)) {
      if (mappedName.includes(lower) || avatarUrl.includes(slug)) {
        return avatarUrl;
      }
    }
  }

  return null;
}

export default getAuthorAvatar;
