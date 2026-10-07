import fs from "node:fs";
import pg from "../web/node_modules/pg/lib/index.js";
const env = fs.readFileSync(new URL("../web/.env", import.meta.url), "utf8").split("\n").find((l) => l.startsWith("DATABASE_URL=")).slice(13).trim().split("?")[0];
const p = new pg.Pool({ connectionString: env, ssl: { rejectUnauthorized: false } });
const rows = [
  ["B09B8X9RGM", "Echo Dot (2022) – Altavoz inteligente con Alexa", "Amazon"],
  ["B0DJGCX6Q2", "Fire TV Stick HD – Reproductor multimedia", "Amazon"],
  ["B094D541XW", "Amazon Basics – Pilas alcalinas de alto rendimiento", "Amazon Basics"],
  ["B07XLML2YS", "TP-Link Tapo C200 – Cámara de vigilancia WiFi", "TP-Link"],
  ["B0H4GYHGZQ", "Smartphone Note 17 – Batería 7700 mAh", ""],
  ["B0GQ3FYM27", "Smartwatch – Top ventas", ""],
  ["B0GQL9JZS7", "Xiaomi Redmi Watch – Smartwatch", "Xiaomi"],
  ["B0G1ZGK7MV", "Amazfit Active – Smartwatch deportivo", "Amazfit"],
  ["B0DFHG6YZ7", "Smartwatch con llamadas Bluetooth y monitor de frecuencia", ""],
  ["B0GJZH9V76", "Amazfit Smartwatch – Pantalla y almacenamiento", "Amazfit"],
  ["B0H8TCWZYF", "Xiaomi Redmi Watch – Gran autonomía", "Xiaomi"],
];
for (const [a, t, b] of rows) {
  await p.query("insert into products(asin,title,brand) values($1,$2,$3) on conflict(asin) do update set title=excluded.title, brand=excluded.brand", [a, t, b]);
}
const r = await p.query("select asin,title,brand from products order by asin");
console.log(JSON.stringify(r.rows));
await p.end();
