/**
 * Offical postgres error codes to match against when checking database exceptions.
 *
 * https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export enum PostgresErrorCodes {
  UNIQUE_VIOLATION = "23505",
}
