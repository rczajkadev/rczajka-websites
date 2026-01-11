import { sanityFetch } from './client';
import {
  allCategoriesQuery,
  allPostsQuery,
  allTagsQuery,
  postBySlugQuery,
  postSlugsQuery
} from './queries';
import type { Post, PostSlug } from './types';

export const getAllPosts = async () => {
  return sanityFetch<Post[]>(allPostsQuery);
};

export const getPostBySlug = async (slug?: string | null) => {
  if (!slug) {
    return null;
  }
  return sanityFetch<Post | null>(postBySlugQuery, { slug });
};

export const getAllSlugs = async () => {
  const slugs = await sanityFetch<PostSlug[]>(postSlugsQuery);
  return slugs.map((item) => item.slug);
};

export const getLatestPosts = async (limit: number) => {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
};

export const getAllTags = async () => {
  const tags = await sanityFetch<string[][]>(allTagsQuery);
  return Array.from(new Set(tags.flat().filter(Boolean))).sort();
};

export const getAllCategories = async () => {
  const categories = await sanityFetch<string[]>(allCategoriesQuery);
  return Array.from(new Set(categories.filter(Boolean))).sort();
};
