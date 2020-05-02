export interface Pagination<PaginationObject> {
  /**
   * a list of items to be returned
   */
  items: PaginationObject[];
  /**
   * associated meta information (e.g., counts)
   */
  meta: PaginationMeta;
}

export interface PaginationMeta {
  /**
   * the amount of items on this specific page
   */
  itemCount: number;
  /**
   * the total amount of items
   */
  totalItems: number;
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  totalPages: number;
  /**
   * the current page this paginator "points" to
   */
  currentPage: number;
}
