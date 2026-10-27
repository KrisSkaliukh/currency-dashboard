const TAG_PALETTES = [
  { background: '#dbeafe', color: '#1d4ed8' },
  { background: '#dcfce7', color: '#15803d' },
  { background: '#ffedd5', color: '#c2410c' },
  { background: '#fce7f3', color: '#be185d' },
  { background: '#ede9fe', color: '#6d28d9' },
  { background: '#e0f2fe', color: '#0369a1' },
  { background: '#fef9c3', color: '#a16207' },
  { background: '#ffe4e6', color: '#be123c' },
] as const;

function hashTag(tag: string): number {
  let hash = 0;
  for (let i = 0; i < tag.length; i += 1) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getTagColors(tag: string): {
  background: string;
  color: string;
} {
  return TAG_PALETTES[hashTag(tag.toLowerCase()) % TAG_PALETTES.length];
}
