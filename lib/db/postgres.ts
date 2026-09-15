import { Pool, QueryResultRow } from 'pg';
import { config } from '../config';

let pool: Pool | undefined;

function getPool(): Pool | null {
  if (!config.database.databaseUrl) return null;

  if (!pool) {
    pool = new Pool({
      connectionString: config.database.databaseUrl,
      max: 8,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return pool;
}

export function hasPostgresDatabase(): boolean {
  return Boolean(config.database.databaseUrl);
}

export async function queryPostgres<T extends QueryResultRow>(
  text: string,
  values: unknown[] = []
): Promise<T[]> {
  const databasePool = getPool();
  if (!databasePool) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const result = await databasePool.query<T>(text, values);
  return result.rows;
}
