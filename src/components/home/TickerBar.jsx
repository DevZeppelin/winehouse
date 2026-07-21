import { useEffect, useState } from "react";
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiFog,
  WiDaySprinkle,
  WiDayRain,
  WiDaySnow,
  WiDayThunderstorm,
} from "react-icons/wi";
import { FaChevronDown, FaNewspaper, FaExternalLinkAlt } from "react-icons/fa";
import { fetchDolar } from "../../lib/dolar";
import { fetchMendozaWeather } from "../../lib/weather";
import { fetchMendozaNews } from "../../lib/news";

const WEATHER_ICONS = {
  sun: WiDaySunny,
  "cloud-sun": WiDayCloudy,
  cloud: WiCloudy,
  fog: WiFog,
  drizzle: WiDaySprinkle,
  rain: WiDayRain,
  snow: WiDaySnow,
  storm: WiDayThunderstorm,
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("es-AR", { dateStyle: "long" }).format(date);

const TickerBar = () => {
  const [dolar, setDolar] = useState(null);
  const [dolarError, setDolarError] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [news, setNews] = useState([]);
  const [newsIndex, setNewsIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchDolar().then(setDolar).catch(() => setDolarError(true));
    fetchMendozaWeather().then(setWeather).catch(() => setWeatherError(true));
    fetchMendozaNews().then(setNews).catch(() => setNews([]));
  }, []);

  useEffect(() => {
    if (news.length < 2) return;
    const id = setInterval(() => setNewsIndex((i) => (i + 1) % news.length), 7000);
    return () => clearInterval(id);
  }, [news]);

  const oficial = dolar?.find((d) => d.casa === "oficial");
  const blue = dolar?.find((d) => d.casa === "blue");
  const WeatherIcon = weather ? WEATHER_ICONS[weather.icon] ?? WiDayCloudy : null;
  const currentNews = news[newsIndex];

  return (
    <div className="relative z-30 border-b border-surfaceBorder bg-surface/80 text-lightBlue backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-1.5 text-xs md:text-sm">
        <span className="hidden shrink-0 text-middleBlue md:inline">
          {formatDate(new Date())}
        </span>

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex shrink-0 items-center gap-3 font-bold hover:text-orange transition-colors"
        >
          {dolarError ? (
            <span className="text-middleBlue/70">Dólar no disponible</span>
          ) : oficial ? (
            <>
              <span>
                Dólar oficial{" "}
                <span className="text-orange">${oficial.venta}</span>
              </span>
              <span className="hidden sm:inline">
                Blue <span className="text-orange">${blue?.venta}</span>
              </span>
            </>
          ) : (
            <span className="skeleton inline-block h-4 w-32 rounded" />
          )}
          <FaChevronDown className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        <div className="flex shrink-0 items-center gap-1.5">
          {weatherError ? (
            <span className="text-middleBlue/70">Clima no disponible</span>
          ) : weather ? (
            <>
              <WeatherIcon className="text-xl text-lightBlue" />
              <span className="font-bold">{weather.temperature}°C</span>
              <span className="hidden text-middleBlue sm:inline">Mendoza · {weather.label}</span>
            </>
          ) : (
            <span className="skeleton inline-block h-4 w-24 rounded" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 text-middleBlue">
          <FaNewspaper className="hidden shrink-0 text-orange md:inline" />
          {currentNews ? (
            <a
              href={currentNews.link}
              target="_blank"
              rel="noreferrer"
              className="truncate hover:text-lightBlue hover:underline"
              title={currentNews.title}
            >
              {currentNews.title}
            </a>
          ) : (
            <span className="skeleton inline-block h-4 w-full max-w-xs rounded" />
          )}
        </div>
      </div>

      {open && (
        <div className="absolute right-2 top-full z-40 mt-2 w-[min(92vw,22rem)] rounded-xl glass-panel p-4 shadow-glow animate-fade-up">
          <p className="mb-2 text-xs uppercase tracking-wide text-middleBlue">Cotización del dólar</p>
          {dolarError && <p className="text-sm text-middleBlue/70">No pudimos obtener la cotización.</p>}
          <div className="space-y-1.5">
            {dolar?.map((d) => (
              <div key={d.casa} className="flex items-center justify-between text-sm">
                <span>{d.nombre}</span>
                <span className="space-x-3">
                  <span className="text-middleBlue">
                    C ${d.compra ?? "—"}
                  </span>
                  <span className="font-bold text-orange">V ${d.venta}</span>
                </span>
              </div>
            ))}
          </div>

          {weather && (
            <>
              <p className="mb-2 mt-4 text-xs uppercase tracking-wide text-middleBlue">Pronóstico Mendoza</p>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {weather.daily.slice(0, 4).map((d, i) => {
                  const Icon = WEATHER_ICONS[d.icon] ?? WiDayCloudy;
                  return (
                    <div key={d.date} className="rounded-lg bg-surfaceLight p-2">
                      <p className="text-middleBlue">
                        {i === 0 ? "Hoy" : new Intl.DateTimeFormat("es-AR", { weekday: "short" }).format(new Date(d.date + "T12:00:00"))}
                      </p>
                      <Icon className="mx-auto my-1 text-2xl" />
                      <p>
                        <span className="font-bold">{d.max}°</span>{" "}
                        <span className="text-middleBlue">{d.min}°</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {news.length > 0 && (
            <>
              <p className="mb-2 mt-4 text-xs uppercase tracking-wide text-middleBlue">Noticias de Mendoza</p>
              <ul className="space-y-1.5">
                {news.slice(0, 4).map((n) => (
                  <li key={n.link}>
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start gap-1.5 text-sm hover:text-orange"
                    >
                      <FaExternalLinkAlt className="mt-1 shrink-0 text-[10px] text-middleBlue" />
                      <span>{n.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TickerBar;
