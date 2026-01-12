import { createClient } from 'next-sanity';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error('Missing SANITY_PROJECT_ID or SANITY_DATASET environment variables.');
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION ?? '2026-01-12',
  useCdn: process.env.SANITY_USE_CDN === 'true'
});

export const sanityFetch = async <T>(
  query: string,
  params: Record<string, unknown> = {}
) => {
  return sanityClient.fetch<T>(query, params, { cache: 'force-cache' });
};
