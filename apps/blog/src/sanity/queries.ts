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
*[_type == "post" && defined(slug.current) && (includeDrafts || !draft)]
| order(publishedAt desc) {
  ${postFields}
}
`;

export const postBySlugQuery = `
*[_type == "post" && slug.current == $slug && (includeDrafts || !draft)][0] {
  ${postFields}
}
`;

export const postSlugsQuery = `
*[_type == "post" && defined(slug.current) && (includeDrafts || !draft)]{
  "slug": slug.current
}
`;

export const allTagsQuery = `
*[_type == "post" && defined(slug.current) && (includeDrafts || !draft) && count(tags) > 0].tags
`;

export const allCategoriesQuery = `
*[_type == "post" && defined(slug.current) && (includeDrafts || !draft) && defined(category)].category
`;
