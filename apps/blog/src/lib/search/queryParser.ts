import type { ParsedSearchQuery } from './types';

const normalizeValue = (value: string) => value.trim().toLowerCase();

/**
 * Parses the posts search syntax:
 * - tag:<value> includes a tag
 * - -tag:<value> excludes a tag
 * - cat:<value> filters by category
 * Remaining tokens become the full-text query (case preserved).
 */
const parseSearchQuery = (input: string): ParsedSearchQuery => {
  const tokens = input.split(/\s+/).filter(Boolean);
  const includeTags: string[] = [];
  const excludeTags: string[] = [];
  let category: string | null = null;
  const textTokens: string[] = [];

  tokens.forEach((token) => {
    const lower = token.toLowerCase();
    if (lower.startsWith('-tag:')) {
      const value = normalizeValue(token.slice(5));
      if (value) {
        excludeTags.push(value);
      }
      return;
    }
    if (lower.startsWith('tag:')) {
      const value = normalizeValue(token.slice(4));
      if (value) {
        includeTags.push(value);
      }
      return;
    }
    if (lower.startsWith('cat:')) {
      const value = normalizeValue(token.slice(4));
      if (value) {
        category = value;
      }
      return;
    }
    textTokens.push(token);
  });

  return {
    text: textTokens.join(' '),
    includeTags: Array.from(new Set(includeTags)),
    excludeTags: Array.from(new Set(excludeTags)),
    category
  };
};

export { normalizeValue, parseSearchQuery };
