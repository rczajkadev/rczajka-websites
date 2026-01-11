import { createClient } from 'next-sanity';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error('Missing SANITY_PROJECT_ID or SANITY_DATASET environment variables.');
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
export const includeDrafts = nodeEnv === 'development' && process.env.HIDE_DRAFTS !== 'true';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION ?? '2024-01-01',
  useCdn: process.env.SANITY_USE_CDN === 'true'
});

export const sanityFetch = async <T>(
  query: string,
  params: Record<string, unknown> = {}
) => {
  return sanityClient.fetch<T>(query, { ...params, includeDrafts }, { cache: 'force-cache' });
};
