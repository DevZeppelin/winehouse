import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import Hero from "../components/home/Hero";
import RegionFilter from "../components/home/RegionFilter";
import CabinCard from "../components/home/CabinCard";
import { fetchPublishedCabins, fetchRegions } from "../lib/api";

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-surfaceBorder bg-surface">
    <div className="skeleton h-52 w-full" />
    <div className="space-y-3 p-4">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  </div>
);

const Home = () => {
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState("");
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRegions().then(setRegions).catch(() => setRegions([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchPublishedCabins({ regionSlug: region || undefined })
      .then(setCabins)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [region]);

  return (
    <div>
      <Hero regions={regions} region={region} onRegionChange={setRegion} />

      <section id="explorar" className="mx-auto w-full max-w-6xl px-4 py-12 scroll-mt-20">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl text-lightBlue">Cabañas disponibles</h2>
          <RegionFilter regions={regions} region={region} onRegionChange={setRegion} />
        </div>

        {error && (
          <p className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-center text-danger">
            No pudimos cargar las cabañas. Revisá que tu proyecto Supabase esté configurado
            (ver .env) y volvé a intentar.
          </p>
        )}

        {!error && loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!error && !loading && cabins.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surfaceBorder py-16 text-center text-middleBlue">
            <FaHome className="text-4xl text-darkBlue" />
            <p>Todavía no hay cabañas publicadas en esta región.</p>
          </div>
        )}

        {!error && !loading && cabins.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cabins.map((cabin) => (
              <CabinCard key={cabin.id} cabin={cabin} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
