import { CATEGORIES, affiliateUrl } from "../../../lib/categories.js";
import { getRankings, categoryBySlug } from "../../../lib/seed.js";
export const dynamic = "force-dynamic"; // ponytail: sin ISR; cada visita lee Postgres (tráfico bajo, datos siempre frescos tras cada carga)
export function generateStaticParams() { return CATEGORIES.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }) {
  const c = categoryBySlug(params.slug);
  return { title: `${c?.name || params.slug}: top 5 más vendidos — elijemejor.shop` };
}
function Card({ p, i, badge }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 14, display: "flex", gap: 12 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#b45309" }}>#{i + 1}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: "#b45309", fontWeight: 700 }}>{badge}</div>
        <b>{p.title || p.asin}</b>
        <div style={{ fontSize: 13, color: "#555" }}>
          {p.rating ? `★ ${p.rating} (${p.reviews_count} reseñas)` : "Sin datos aún — cura el CSV"} · {p.precio ? `${p.precio} €` : "ver precio"}
        </div>
        <a href={affiliateUrl(p.asin)} rel="nofollow sponsored noopener" target="_blank"
           style={{ display: "inline-block", marginTop: 8, background: "#febd69", padding: "8px 14px", borderRadius: 8, textDecoration: "none", color: "#111", fontWeight: 700 }}>
          Ver en Amazon
        </a>
      </div>
    </div>
  );
}
export default async function CategoryPage({ params }) {
  const cat = categoryBySlug(params.slug);
  if (!cat) return <p>No existe esta categoría.</p>;
  const data = await getRankings("es", params.slug);
  const jsonLd = {
    "@context": "https://schema.org", "@type": "ItemList", name: `Top ${cat.name}`,
    itemListElement: [...data.bestseller, ...data["top-rated"]].slice(0, 10).map((p, i) => ({
      "@type": "ListItem", position: i + 1, url: affiliateUrl(p.asin), name: p.title || p.asin,
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a href="/es" style={{ fontSize: 13 }}>← Todas las categorías</a>
      <h1>{cat.name}: los 5 más vendidos y valorados</h1>
      <p style={{ fontSize: 13, color: "#555" }}>
        {data.updatedAt ? `Actualizado: ${data.updatedAt}` : "Modo manual: rellena db/plantilla_rankings_es.csv con ASIN reales de amazon.es"} · Enlaces de afiliado.
      </p>
      <h2>🔥 Más vendidos</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {data.bestseller.length ? data.bestseller.map((p, i) => <Card key={p.asin} p={p} i={i} badge="MÁS VENDIDO" />)
          : <p style={{ color: "#777" }}>Vacío: importa el CSV a Postgres (ver DEPLOY.md) o cura los ASIN.</p>}
      </div>
      <h2>⭐ Más valorados</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {data["top-rated"].length ? data["top-rated"].map((p, i) => <Card key={p.asin} p={p} i={i} badge="MEJOR VALORADO" />)
          : <p style={{ color: "#777" }}>Vacío: mismo CSV, tipo=top-rated.</p>}
      </div>
    </>
  );
}
