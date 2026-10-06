export const metadata = { title: "elijemejor.shop — Los más vendidos de Amazon España", description: "Top 5 más vendidos y más valorados por categoría, actualizado a diario." };
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#fafafa", color: "#111" }}>
        <header style={{ background: "#131921", color: "#fff", padding: "14px 20px" }}>
          <a href="/es" style={{ color: "#febd69", fontWeight: 800, textDecoration: "none" }}>elijemejor.shop</a>
          <span style={{ opacity: 0.7, marginLeft: 10, fontSize: 13 }}>Afiliado Amazon ES · Top 5 por categoría</span>
        </header>
        <main style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>{children}</main>
        <footer style={{ maxWidth: 1000, margin: "0 auto", padding: "20px", fontSize: 12, color: "#555" }}>
          Como Afiliado de Amazon, gano por compras elegibles. Precios y disponibilidad pueden variar en amazon.es.
        </footer>
      </body>
    </html>
  );
}
