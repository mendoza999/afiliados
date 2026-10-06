import { getPool } from "./db.js";
import { CATEGORIES } from "./categories.js";

// Lee rankings de Postgres; si no hay DB (VPS aún no listo), devuelve placeholder
// para que Hostinger compile y puedas curar el CSV.
export async function getRankings(country, slug) {
  const pool = getPool();
  if (!pool) return { bestseller: [], "top-rated": [], updatedAt: null, fromDb: false };
  try {
    const { rows } = await pool.query(
      `select r.tipo, r.posicion, r.precio, r.fecha, p.asin, p.title, p.brand, p.image, p.rating, p.reviews_count
       from rankings r join products p on p.asin = r.asin
       where r.country=$1 and r.category_slug=$2 and r.fecha = (select max(fecha) from rankings where country=$1 and category_slug=$2)
       order by r.tipo, r.posicion`,
      [country, slug]
    );
    if (!rows.length) return { bestseller: [], "top-rated": [], updatedAt: null, fromDb: true };
    const g = { bestseller: [], "top-rated": [], updatedAt: rows[0].fecha, fromDb: true };
    for (const r of rows) g[r.tipo]?.push(r);
    return g;
  } catch {
    return { bestseller: [], "top-rated": [], updatedAt: null, fromDb: false };
  }
}

export function categoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}
