// Uso: DATABASE_URL=... node db/import.mjs db/plantilla_rankings_es.csv
// Sin dependencias: solo 'pg' (ya instalada en web/) + fs. Corre desde web/ o con NODE_PATH.
import fs from "node:fs";
import pg from "pg";
const csv = fs.readFileSync(process.argv[2], "utf8").trim().split("\n").slice(1);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
for (const line of csv) {
  const m = line.match(/^([^,]+),([^,]+),(\d+),([^,]*),("(?:[^"]|"")*"|[^,]*),([\d.]+)/);
  if (!m || !m[4]) continue; // filas sin ASIN se saltan
  const [, slug, tipo, pos, asin, title, precio] = m;
  await pool.query(
    `insert into products(asin,title) values($1,$2) on conflict(asin) do update set title=excluded.title`,
    [asin, title.replace(/^"|"$/g, "").slice(0, 200) || asin]
  );
  await pool.query(
    `insert into rankings(country,category_slug,tipo,posicion,asin,precio,source) values('es',$1,$2,$3,$4,$5,'manual')
     on conflict(country,category_slug,tipo,posicion,fecha) do update set asin=excluded.asin, precio=excluded.precio`,
    [slug, tipo, +pos, asin, +precio || null]
  );
}
await pool.end();
console.log("import ok:", csv.length, "filas leídas");
