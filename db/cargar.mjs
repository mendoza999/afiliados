// Carga rápida: pegas URLs de amazon.es y genera el INSERT.
// Uso: node db/cargar.mjs <slug> <bestseller|top-rated> "<url1>" "<url2>" ... (5 URLs)
// Extrae el ASIN de cada URL y emite SQL listo para psql. Título/precio los pones a mano o los editas luego.
const [, , slug, tipo, ...urls] = process.argv;
if (!slug || !["bestseller", "top-rated"].includes(tipo) || !urls.length) {
  console.log('Uso: node db/cargar.mjs freidora-aire bestseller "<url1>" ... "<url5>"');
  process.exit(1);
}
const asins = urls.map((u) => (u.match(/\/dp\/([A-Z0-9]{10})/) || [])[1]).filter(Boolean);
if (asins.length !== urls.length) { console.error("Alguna URL no tiene /dp/ASIN válido"); process.exit(1); }
let sql = "";
asins.forEach((asin, i) => {
  sql += `insert into products(asin,title) values('${asin}','${slug} #${i + 1}') on conflict(asin) do nothing;\n`;
  sql += `insert into rankings(country,category_slug,tipo,posicion,asin,source) values('es','${slug}','${tipo}',${i + 1},'${asin}','manual') on conflict(country,category_slug,tipo,posicion,fecha) do update set asin=excluded.asin;\n`;
});
console.log(sql);
