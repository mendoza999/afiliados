import { Pool } from "pg";
// ponytail: un solo Pool global, sin ORM.
let pool;
export function getPool() {
  if (!process.env.DATABASE_URL) return null;
  // ponytail: VPS con cert autofirmado -> no verificar CA, solo cifrar.
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, ssl: { rejectUnauthorized: false } });
  return pool;
}
