import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchPendingSubscriptions,
  fetchAllCabinsAdmin,
  updateCabinStatusAdmin,
} from "../lib/api";
import PendingSubscriptionRow from "../components/admin/PendingSubscriptionRow";
import StatusBadge from "../components/ui/StatusBadge";
import Spinner from "../components/ui/Spinner";

const CABIN_STATUSES = ["draft", "pending_review", "published", "suspended"];

const Admin = () => {
  const [pending, setPending] = useState(null);
  const [cabins, setCabins] = useState(null);

  const loadPending = () => fetchPendingSubscriptions().then(setPending).catch(() => setPending([]));
  const loadCabins = () => fetchAllCabinsAdmin().then(setCabins).catch(() => setCabins([]));

  useEffect(() => {
    loadPending();
    loadCabins();
  }, []);

  const handleResolved = (id) => {
    setPending((p) => p.filter((s) => s.id !== id));
    loadCabins();
  };

  const handleStatusChange = async (cabinId, status) => {
    try {
      await updateCabinStatusAdmin(cabinId, status);
      setCabins((cs) => cs.map((c) => (c.id === cabinId ? { ...c, status } : c)));
      toast.success("Estado actualizado");
    } catch {
      toast.error("No pudimos actualizar el estado");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="font-display mb-8 text-3xl text-lightBlue">Panel de administración</h1>

      <section className="mb-12">
        <h2 className="font-display mb-4 text-xl text-lightBlue">
          Suscripciones pendientes de aprobación
        </h2>
        {pending === null && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}
        {pending?.length === 0 && (
          <p className="rounded-xl border border-dashed border-surfaceBorder p-6 text-center text-middleBlue">
            No hay pagos pendientes de revisión.
          </p>
        )}
        {pending?.length > 0 && (
          <div className="space-y-3">
            {pending.map((s) => (
              <PendingSubscriptionRow key={s.id} subscription={s} onResolved={handleResolved} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display mb-4 text-xl text-lightBlue">Todas las cabañas</h2>
        {cabins === null && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}
        {cabins?.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-surfaceBorder">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-surfaceLight text-middleBlue">
                <tr>
                  <th className="p-3">Cabaña</th>
                  <th className="p-3">Dueño</th>
                  <th className="p-3">Región</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Cambiar a</th>
                </tr>
              </thead>
              <tbody>
                {cabins.map((c) => (
                  <tr key={c.id} className="border-t border-surfaceBorder text-lightBlue">
                    <td className="p-3 font-bold">{c.name}</td>
                    <td className="p-3 text-middleBlue">{c.owner?.full_name}</td>
                    <td className="p-3 text-middleBlue">{c.region?.name}</td>
                    <td className="p-3">
                      <StatusBadge type="cabin" status={c.status} />
                    </td>
                    <td className="p-3">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        className="rounded-lg border border-surfaceBorder bg-surfaceLight px-2 py-1 text-lightBlue"
                      >
                        {CABIN_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Admin;
