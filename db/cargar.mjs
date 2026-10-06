// Carga rápida: pegas URLs de amazon.es e inserta directo en Postgres.
// Uso: node db/cargar.mjs <slug> <bestseller|top-rated> "<url1>" ... "<url5>" [--print]
// Sin --print inserta directo (lee DATABASE_URL de web/.env). Con --print solo imprime SQL.
import fs from "node:fs";

const SLUGS = ["auriculares-bluetooth","smartwatch","altavoz-bluetooth","monitor-4k","teclado-mecanico","silla-gaming","freidora-aire","robot-aspirador","cafetera-expreso","aspiradora-vertical","serum-vitamina-c","lego-sets"];
const args = process.argv.slice(2).filter((a) => a !== "--print");
const printOnly = process.argv.includes("--print");
const [slug, tipo, ...urls] = args;
if (!SLUGS.includes(slug)) { console.error("Slug inválido. Válidos: " + SLUGS.join(", ")); process.exit(1); }
if (!["bestseller", "top-rated"].includes(tipo) || !urls.length) {
  console.log('Uso: node db/cargar.mjs freidora-aire bestseller "<url1>" ... "<url5>"');
  process.exit(1);
}
const asins = urls.map((u) => (u.match(/\/(?:dp|gp\/(?:product|aw\/d))\/([A-Z0-9]{10})/) || [])[1]).filter(Boolean);
if (asins.length !== urls.length) { console.error("Alguna URL no tiene /dp/ASIN válido"); process.exit(1); }
if (printOnly) {
  asins.forEach((asin, i) => {
    console.log(`insert into products(asin,title) values('${asin}','${slug} #${i + 1}') on conflict(asin) do nothing;`);
    console.log(`insert into rankings(country,category_slug,tipo,posicion,asin,source) values('es','${slug}','${tipo}',${i + 1},'${asin}','manual') on conflict(country,category_slug,tipo,posicion,fecha) do update set asin=excluded.asin;`);
  });
  process.exit(0);
}
// Inserción directa (pg vive en web/node_modules)
let pg;
try { pg = (await import("pg")).default; }
catch { pg = (await import("../web/node_modules/pg/lib/index.js")).default; }
const envLine = fs.readFileSync(new URL("../web/.env", import.meta.url), "utf8").split("\n").find((l) => l.startsWith("DATABASE_URL="));
const pool = new pg.Pool({ connectionString: envLine.slice(13).trim().split("?")[0], ssl: { rejectUnauthorized: false } });
for (let i = 0; i < asins.length; i++) {
  await pool.query(`insert into products(asin,title) values($1,$2) on conflict(asin) do nothing`, [asins[i], `${slug} #${i + 1}`]);
  await pool.query(
    `insert into rankings(country,category_slug,tipo,posicion,asin,source) values('es',$1,$2,$3,$4,'manual') on conflict(country,category_slug,tipo,posicion,fecha) do update set asin=excluded.asin`,
    [slug, tipo, i + 1, asins[i]]
  );
}
await pool.end();
console.log(`OK: ${slug} ${tipo} -> ${asins.join(", ")}`);
