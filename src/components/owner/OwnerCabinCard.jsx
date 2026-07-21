import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaChevronDown, FaExternalLinkAlt, FaCheck, FaTimes } from "react-icons/fa";
import StatusBadge from "../ui/StatusBadge";
import PlanBadge from "../ui/PlanBadge";
import { fetchCabinBookings, updateBookingStatus } from "../../lib/api";

const formatDate = (d) => new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" }).format(new Date(d + "T12:00:00"));

const OwnerCabinCard = ({ cabin }) => {
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);

  const latestSub = [...(cabin.subscriptions || [])].sort(
    (a, b) => new Date(b.requested_at) - new Date(a.requested_at)
  )[0];

  const toggle = async () => {
    setOpen((o) => !o);
    if (!open && bookings === null) {
      setLoading(true);
      try {
        setBookings(await fetchCabinBookings(cabin.id));
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings((bs) => bs.map((b) => (b.id === bookingId ? { ...b, status } : b)));
      toast.success(status === "confirmed" ? "Reserva confirmada" : "Reserva cancelada");
    } catch {
      toast.error("No pudimos actualizar la reserva");
    }
  };

  return (
    <div className="rounded-2xl border border-surfaceBorder bg-surface shadow-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <img
          src={cabin.cover_image || "/example.jpg"}
          alt={cabin.name}
          className="h-20 w-full rounded-lg object-cover sm:w-28"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg text-lightBlue">{cabin.name}</h3>
            <StatusBadge type="cabin" status={cabin.status} />
            {latestSub && <StatusBadge type="subscription" status={latestSub.status} />}
            {latestSub?.plan && <PlanBadge slug={latestSub.plan.slug} name={latestSub.plan.name} />}
          </div>
          <p className="text-sm text-middleBlue">
            {cabin.region?.name} · ${Number(cabin.price_per_night).toLocaleString("es-AR")}/noche
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/cabanas/${cabin.slug}`}
            target="_blank"
            className="rounded-lg border-2 border-darkBlue p-2 text-lightBlue hover:bg-darkBlue"
            title="Ver publicación"
          >
            <FaExternalLinkAlt className="text-sm" />
          </Link>
          <button
            onClick={toggle}
            className="flex items-center gap-1 rounded-lg bg-surfaceLight px-3 py-2 text-sm font-bold text-lightBlue"
          >
            Reservas <FaChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-surfaceBorder p-4">
          {loading && <p className="text-sm text-middleBlue">Cargando reservas...</p>}
          {!loading && bookings?.length === 0 && (
            <p className="text-sm text-middleBlue">Todavía no recibiste solicitudes de reserva.</p>
          )}
          {!loading && bookings?.length > 0 && (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surfaceLight px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-bold text-lightBlue">
                      {b.guest_name} · {formatDate(b.check_in)} → {formatDate(b.check_out)}
                    </p>
                    <p className="text-middleBlue">{b.guest_phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge type="booking" status={b.status} />
                    {b.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatus(b.id, "confirmed")}
                          className="rounded-full bg-success/20 p-1.5 text-success hover:bg-success/30"
                          title="Confirmar"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleStatus(b.id, "cancelled")}
                          className="rounded-full bg-danger/20 p-1.5 text-danger hover:bg-danger/30"
                          title="Cancelar"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerCabinCard;
