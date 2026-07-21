import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { fetchOwnerCabins } from "../lib/api";
import OwnerCabinCard from "../components/owner/OwnerCabinCard";
import Spinner from "../components/ui/Spinner";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [cabins, setCabins] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchOwnerCabins(user.id).then(setCabins).catch(() => setCabins([]));
  }, [user]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-lightBlue">Mi panel</h1>
          <p className="text-middleBlue">Hola, {profile?.full_name || user?.email}</p>
        </div>
        <Link
          to="/publicar"
          className="button flex items-center gap-2 rounded-lg bg-orange px-4 py-2.5 font-extrabold uppercase text-background hover:bg-lightBlue"
        >
          <FaPlus /> Nueva cabaña
        </Link>
      </div>

      {cabins === null && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {cabins?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-surfaceBorder py-16 text-center text-middleBlue">
          Todavía no publicaste ninguna cabaña.
          <br />
          <Link to="/publicar" className="mt-2 inline-block font-bold text-orange hover:underline">
            Publicá tu primera cabaña
          </Link>
        </div>
      )}

      {cabins?.length > 0 && (
        <div className="space-y-4">
          {cabins.map((cabin) => (
            <OwnerCabinCard key={cabin.id} cabin={cabin} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
