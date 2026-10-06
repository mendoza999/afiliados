import { CATEGORIES } from "../../lib/categories.js";
export const revalidate = 86400;
export default function EsHome() {
  return (
    <>
      <h1>Los 5 más vendidos de cada categoría</h1>
      <p style={{ color: "#555" }}>Elige una categoría. Cada ficha enlaza a Amazon con tu tag de afiliado.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {CATEGORIES.map((c) => (
          <a key={c.slug} href={`/es/${c.slug}`} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 16, textDecoration: "none", color: "#111" }}>
            <b>{c.name}</b>
            <div style={{ fontSize: 13, color: "#555" }}>Top 5 ventas + Top 5 valorados →</div>
          </a>
        ))}
      </div>
    </>
  );
}
