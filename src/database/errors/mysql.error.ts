export interface MysqlError extends Error {
  code: string;
  errno: number;
  sqlState: string;
  sqlMessage: string;
}

export function isMysqlError(error: unknown): error is MysqlError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'errno' in error &&
    'sqlState' in error &&
    'sqlMessage' in error
  );
}
