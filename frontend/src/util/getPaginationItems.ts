export const getPaginationItems = (
  currentPage: number,
  totalPages: number,
  delta: number = 1
): (number | null)[] => {
  const left = currentPage - delta;
  const right = currentPage + delta;

  const range = Array.from(Array(totalPages))
    .map((e, i) => i + 1)
    .filter((i) => i === 1 || i === totalPages || (i >= left && i <= right))
    .reduce((pages: (number | null)[], page, i) => {
      if (pages.length !== 0) {
        const prevPage = pages[pages.length - 1];
        if (prevPage !== null) {
          const diff = page - prevPage;
          if (diff > 1) {
            pages.push(null);
          }
        }
      }

      pages.push(page);

      return pages;
    }, []);

  return range;
};
