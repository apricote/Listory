interface TopListItemEntity {
  count: number;
}

/**
 * Get max count for top list. Returns at least 1 to make sure we do not run into issues
 * with empty list (would normally return -Infinity) or 0 (could cause divide by zero error).
 */
export function getMaxCount(items: TopListItemEntity[]): number {
  return Math.max(1, ...items.map(({ count }) => count));
}
