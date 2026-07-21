const MENDOZA_LAT = -32.8895;
const MENDOZA_LON = -68.8458;

const ENDPOINT =
  `https://api.open-meteo.com/v1/forecast?latitude=${MENDOZA_LAT}&longitude=${MENDOZA_LON}` +
  "&current=temperature_2m,weather_code,wind_speed_10m" +
  "&daily=temperature_2m_max,temperature_2m_min,weather_code" +
  "&timezone=America%2FArgentina%2FMendoza&forecast_days=4";

// https://open-meteo.com/en/docs — tabla de códigos WMO
const WEATHER_CODES = {
  0: { label: "Despejado", icon: "sun" },
  1: { label: "Mayormente despejado", icon: "sun" },
  2: { label: "Parcialmente nublado", icon: "cloud-sun" },
  3: { label: "Nublado", icon: "cloud" },
  45: { label: "Niebla", icon: "fog" },
  48: { label: "Niebla helada", icon: "fog" },
  51: { label: "Llovizna leve", icon: "drizzle" },
  53: { label: "Llovizna", icon: "drizzle" },
  55: { label: "Llovizna intensa", icon: "drizzle" },
  56: { label: "Llovizna helada", icon: "drizzle" },
  57: { label: "Llovizna helada intensa", icon: "drizzle" },
  61: { label: "Lluvia leve", icon: "rain" },
  63: { label: "Lluvia", icon: "rain" },
  65: { label: "Lluvia intensa", icon: "rain" },
  66: { label: "Lluvia helada", icon: "rain" },
  67: { label: "Lluvia helada intensa", icon: "rain" },
  71: { label: "Nevada leve", icon: "snow" },
  73: { label: "Nevada", icon: "snow" },
  75: { label: "Nevada intensa", icon: "snow" },
  77: { label: "Granizo fino", icon: "snow" },
  80: { label: "Chubascos leves", icon: "rain" },
  81: { label: "Chubascos", icon: "rain" },
  82: { label: "Chubascos intensos", icon: "rain" },
  85: { label: "Chubascos de nieve", icon: "snow" },
  86: { label: "Chubascos de nieve intensos", icon: "snow" },
  95: { label: "Tormenta", icon: "storm" },
  96: { label: "Tormenta con granizo", icon: "storm" },
  99: { label: "Tormenta fuerte con granizo", icon: "storm" },
};

export function describeWeatherCode(code) {
  return WEATHER_CODES[code] ?? { label: "—", icon: "cloud" };
}

export async function fetchMendozaWeather() {
  const res = await fetch(ENDPOINT);
  if (!res.ok) throw new Error(`open-meteo respondió ${res.status}`);
  const data = await res.json();

  return {
    temperature: Math.round(data.current.temperature_2m),
    windSpeed: Math.round(data.current.wind_speed_10m),
    ...describeWeatherCode(data.current.weather_code),
    daily: data.daily.time.map((date, i) => ({
      date,
      max: Math.round(data.daily.temperature_2m_max[i]),
      min: Math.round(data.daily.temperature_2m_min[i]),
      ...describeWeatherCode(data.daily.weather_code[i]),
    })),
  };
}
