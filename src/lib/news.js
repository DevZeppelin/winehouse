const QUERY = "Mendoza turismo OR cabañas OR clima";
const GOOGLE_NEWS_URL =
  "https://news.google.com/rss/search?q=" +
  encodeURIComponent(QUERY) +
  "&hl=es-419&gl=AR&ceid=AR:es-419";

const RSS2JSON_URL =
  "https://api.rss2json.com/v1/api.json?count=8&rss_url=" + encodeURIComponent(GOOGLE_NEWS_URL);

const CACHE_KEY = "wh_news_cache_v1";
const CACHE_TTL_MS = 30 * 60 * 1000;

function stripSource(title) {
  // Google News suele agregar " - Medio" al final del título
  const idx = title.lastIndexOf(" - ");
  return idx > 20 ? title.slice(0, idx) : title;
}

export async function fetchMendozaNews() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return cached.items;
    }
  } catch {
    // localStorage no disponible o corrupto, seguimos con el fetch
  }

  const res = await fetch(RSS2JSON_URL);
  if (!res.ok) throw new Error(`rss2json respondió ${res.status}`);
  const data = await res.json();
  if (data.status !== "ok") throw new Error(data.message || "feed inválido");

  const items = data.items.slice(0, 8).map((item) => ({
    title: stripSource(item.title),
    link: item.link,
    date: item.pubDate,
  }));

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
  } catch {
    // sin espacio en localStorage, no es crítico
  }

  return items;
}
