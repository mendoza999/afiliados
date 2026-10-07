import { Pool } from "pg";
// ponytail: un solo Pool global, sin ORM.
let pool;
export function getPool() {
  if (!process.env.DATABASE_URL) return null;
  // ponytail: pg>=8.22 trata sslmode=require como verify-full y el sufijo de la URL
  // pisa el objeto ssl. Se quita el querystring y se fuerza TLS sin verificar CA (VPS autofirmado).
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL.split("?")[0], max: 3, ssl: { rejectUnauthorized: false } });
  return pool;
}
