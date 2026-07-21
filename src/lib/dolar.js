const ENDPOINT = "https://dolarapi.com/v1/dolares";

const LABELS = {
  oficial: "Oficial",
  blue: "Blue",
  bolsa: "MEP",
  contadoconliqui: "CCL",
  mayorista: "Mayorista",
  cripto: "Cripto",
  tarjeta: "Tarjeta",
};

const ORDER = ["oficial", "blue", "tarjeta", "mayorista", "bolsa", "contadoconliqui", "cripto"];

export async function fetchDolar() {
  const res = await fetch(ENDPOINT);
  if (!res.ok) throw new Error(`dolarapi respondió ${res.status}`);
  const data = await res.json();

  return data
    .filter((d) => LABELS[d.casa])
    .map((d) => ({
      casa: d.casa,
      nombre: LABELS[d.casa] ?? d.nombre,
      compra: d.compra,
      venta: d.venta,
      actualizado: d.fechaActualizacion,
    }))
    .sort((a, b) => ORDER.indexOf(a.casa) - ORDER.indexOf(b.casa));
}
