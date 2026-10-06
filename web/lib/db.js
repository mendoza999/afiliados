import { Pool } from "pg";
// ponytail: un solo Pool global, sin ORM.
let pool;
export function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  return pool;
}
