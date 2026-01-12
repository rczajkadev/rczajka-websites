const clampPage = (page: number, totalPages: number) => {
  return Math.min(page, totalPages);
};

export const paginate = <T>(items: T[], page: number, perPage: number) => {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = clampPage(page, totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const pageItems = items.slice(startIndex, startIndex + perPage);

  return {
    pageItems,
    totalItems: items.length,
    totalPages,
    currentPage
  };
};
