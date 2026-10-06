import { getPool } from "../../../lib/db.js";
// Diagnóstico: abre /api/health en el navegador.
// {"db":"ok","rankings":10} = todo bien. {"db":"ERR:..."} = mira el mensaje (env, IP bloqueada, etc).
export async function GET() {
  const pool = getPool();
  if (!pool) return Response.json({ ok: true, site: "elijemejor.shop", db: "no-DATABASE_URL" });
  try {
    const r = await pool.query("select count(*)::int n from rankings where fecha = current_date");
    return Response.json({ ok: true, site: "elijemejor.shop", db: "ok", rankings: r.rows[0].n });
  } catch (e) {
    return Response.json({ ok: true, site: "elijemejor.shop", db: "ERR: " + e.message });
  }
}
