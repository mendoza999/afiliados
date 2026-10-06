// Única fuente de categorías. Añadir com/mx aquí cuando haya tags.
export const COUNTRY = "es";
export const PARTNER_TAG = process.env.PARTNER_TAG || "tecnologiaspe-21";
export const CATEGORIES = [
  ["auriculares-bluetooth", "Auriculares Bluetooth", "auriculares bluetooth"],
  ["smartwatch", "Smartwatch", "smartwatch"],
  ["altavoz-bluetooth", "Altavoz Bluetooth", "altavoz bluetooth"],
  ["monitor-4k", "Monitor 4K", "monitor 4k"],
  ["teclado-mecanico", "Teclado Mecánico", "teclado mecánico"],
  ["silla-gaming", "Silla Gaming", "silla gaming"],
  ["freidora-aire", "Freidora de Aire", "freidora de aire"],
  ["robot-aspirador", "Robot Aspirador", "robot aspirador"],
  ["cafetera-expreso", "Cafetera Expreso", "cafetera expreso"],
  ["aspiradora-vertical", "Aspiradora sin Cable", "aspiradora sin cable"],
  ["serum-vitamina-c", "Sérum Vitamina C", "sérum vitamina c"],
  ["lego-sets", "LEGO", "lego"],
].map(([slug, name, keyword]) => ({ slug, name, keyword }));

export function affiliateUrl(asin) {
  return `https://www.amazon.es/dp/${asin}?tag=${PARTNER_TAG}`;
}
