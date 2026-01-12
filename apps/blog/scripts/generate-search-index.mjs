import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { config as loadEnv } from 'dotenv';
import MiniSearch from 'minisearch';
import { createClient } from '@sanity/client';
import { toPlainText } from '@portabletext/toolkit';

const envRoot = process.cwd();
loadEnv({ path: path.join(envRoot, '.env') });
loadEnv({ path: path.join(envRoot, '.env.local'), override: true });

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  console.error('Missing SANITY_PROJECT_ID or SANITY_DATASET environment variables.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION ?? '2024-01-01',
  useCdn: process.env.SANITY_USE_CDN === 'true'
});

const query = `
*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  category,
  tags,
  body
}
`;

const posts = await client.fetch(query);

const documents = posts.map((post) => ({
  id: post._id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt ?? '',
  publishedAt: post.publishedAt,
  tags: post.tags ?? [],
  category: post.category ?? '',
  content: toPlainText(post.body ?? [])
}));

const miniSearch = new MiniSearch({
  idField: 'id',
  fields: ['title', 'content', 'tags', 'category'],
  storeFields: ['id', 'slug', 'title', 'excerpt', 'publishedAt', 'tags', 'category'],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: {
      title: 3,
      tags: 2,
      category: 2
    }
  }
});

miniSearch.addAll(documents);

const outputDir = path.join(process.cwd(), 'public');
await mkdir(outputDir, { recursive: true });

const searchIndexPath = path.join(outputDir, 'search-index.json');
const searchDocsPath = path.join(outputDir, 'search-docs.json');

const storedDocs = documents.map(({ content, ...doc }) => doc);

await Promise.all([
  writeFile(searchIndexPath, JSON.stringify(miniSearch.toJSON()), 'utf8'),
  writeFile(searchDocsPath, JSON.stringify(storedDocs), 'utf8')
]);

console.log(`Search index written to ${searchIndexPath}`);
