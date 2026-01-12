export const slugify = (value: string) => {
  const normalized = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  return normalized
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const buildHeadingId = (text: string, key?: string) => {
  const base = slugify(text || 'section');
  return key ? `${base}-${key.slice(0, 6)}` : base;
};
