// Sync diario Creators API — PLACEHOLDER hasta aprobación de keys.
// Cuando tengas AMZ_ACCESS_KEY/SECRET: implementar firma + SearchItems aquí.
// Hasta entonces devuelve 503 para no sobreescribir datos manuales.
export async function GET(req) {
  if (!process.env.AMZ_ACCESS_KEY) {
    return Response.json({ ok: false, error: "manual-mode: sin Creators API, la web sirve Postgres/CSV" }, { status: 503 });
  }
  return Response.json({ ok: false, error: "not-implemented: añadir firma Creators API" }, { status: 501 });
}
