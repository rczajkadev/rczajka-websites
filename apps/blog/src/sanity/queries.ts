const postFields = `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  updatedAt,
  excerpt,
  category,
  tags,
  body
`;

export const allPostsQuery = `
*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  ${postFields}
}
`;

export const postBySlugQuery = `
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`;

export const postSlugsQuery = `
*[_type == "post" && defined(slug.current)]{
  "slug": slug.current
}
`;

export const allTagsQuery = `
*[_type == "post" && defined(slug.current) && count(tags) > 0].tags
`;

export const allCategoriesQuery = `
*[_type == "post" && defined(slug.current) && defined(category)].category
`;
