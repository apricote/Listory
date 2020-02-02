export class PagingObject<T = any> {
  /**
   * A link to the Web API endpoint returning the full result of the request
   */
  href: string;

  /**
   * The requested data
   */
  items: T[];

  /**
   * The maximum number of items in the response (as set in the query or by default).
   */
  limit: number;

  /**
   * URL to the next page of items. ( null if none)
   */
  next: string;

  /**
   * The offset of the items returned (as set in the query or by default)
   */
  offset: number;

  /**
   * URL to the previous page of items. ( null if none)
   */
  previous: string;

  /**
   * The total number of items available to return.
   */
  total: number;
}
