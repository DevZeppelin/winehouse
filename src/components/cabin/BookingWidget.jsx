import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { differenceInCalendarDays, parseISO, startOfDay, subDays } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { FaWhatsapp, FaPaperPlane } from "react-icons/fa";
import { createBookingRequest } from "../../lib/api";

const rangesOverlap = (aFrom, aTo, bFrom, bTo) => aFrom < bTo && aTo > bFrom;

const BookingWidget = ({ cabin, bookedDates, onBooked }) => {
  const [range, setRange] = useState();
  const [form, setForm] = useState({ guestName: "", guestPhone: "", guestEmail: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const bookedIntervals = useMemo(
    () =>
      bookedDates.map((b) => ({
        from: startOfDay(parseISO(b.check_in)),
        to: startOfDay(parseISO(b.check_out)),
      })),
    [bookedDates]
  );

  // react-day-picker's DateRange matcher disables both endpoints inclusively,
  // pero el día de checkout queda libre para un nuevo check-in: le restamos un día.
  const disabledMatchers = useMemo(
    () => [
      { before: startOfDay(new Date()) },
      ...bookedIntervals.map((b) => ({ from: b.from, to: subDays(b.to, 1) })),
    ],
    [bookedIntervals]
  );

  const handleSelect = (newRange) => {
    if (newRange?.from && newRange?.to) {
      const overlaps = bookedIntervals.some((b) =>
        rangesOverlap(newRange.from, newRange.to, b.from, b.to)
      );
      if (overlaps) {
        toast.error("Esas fechas se cruzan con una reserva existente");
        setRange({ from: newRange.from, to: undefined });
        return;
      }
    }
    setRange(newRange);
  };

  const nights = range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) : 0;
  const total = nights * Number(cabin.price_per_night || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!range?.from || !range?.to) {
      toast.error("Elegí las fechas de tu estadía en el calendario");
      return;
    }
    if (!form.guestName || !form.guestPhone) {
      toast.error("Completá tu nombre y teléfono");
      return;
    }

    setSubmitting(true);
    try {
      await createBookingRequest({
        cabinId: cabin.id,
        guestName: form.guestName,
        guestPhone: form.guestPhone,
        guestEmail: form.guestEmail,
        checkIn: range.from.toISOString().slice(0, 10),
        checkOut: range.to.toISOString().slice(0, 10),
        message: form.message,
      });
      toast.success("¡Solicitud enviada! El dueño va a confirmarte por WhatsApp o email.");
      setForm({ guestName: "", guestPhone: "", guestEmail: "", message: "" });
      setRange(undefined);
      onBooked?.();
    } catch (err) {
      toast.error(err.message?.includes("exclude") || err.code === "23P01"
        ? "Esas fechas ya no están disponibles, elegí otras."
        : "No pudimos enviar la solicitud, intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-surfaceBorder bg-surface p-4 shadow-card md:p-6">
      <h3 className="font-display mb-4 text-xl text-lightBlue">Reservá tu estadía</h3>

      <div className="flex justify-center overflow-x-auto">
        <DayPicker
          mode="range"
          locale={es}
          numberOfMonths={1}
          fromMonth={new Date()}
          selected={range}
          onSelect={handleSelect}
          disabled={disabledMatchers}
        />
      </div>

      {nights > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-surfaceLight px-4 py-3 text-lightBlue">
          <span>
            {nights} {nights === 1 ? "noche" : "noches"}
          </span>
          <span className="text-xl font-black text-orange">
            ${total.toLocaleString("es-AR")}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          value={form.guestName}
          onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))}
          placeholder="Tu nombre"
          className="w-full rounded-lg border border-surfaceBorder bg-surfaceLight px-3 py-2 text-lightBlue placeholder-middleBlue/50 outline-none focus:border-middleBlue"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            value={form.guestPhone}
            onChange={(e) => setForm((f) => ({ ...f, guestPhone: e.target.value }))}
            placeholder="Teléfono"
            className="w-full rounded-lg border border-surfaceBorder bg-surfaceLight px-3 py-2 text-lightBlue placeholder-middleBlue/50 outline-none focus:border-middleBlue"
          />
          <input
            value={form.guestEmail}
            onChange={(e) => setForm((f) => ({ ...f, guestEmail: e.target.value }))}
            placeholder="Email (opcional)"
            className="w-full rounded-lg border border-surfaceBorder bg-surfaceLight px-3 py-2 text-lightBlue placeholder-middleBlue/50 outline-none focus:border-middleBlue"
          />
        </div>
        <textarea
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Mensaje para el dueño (opcional)"
          rows={2}
          className="w-full rounded-lg border border-surfaceBorder bg-surfaceLight px-3 py-2 text-lightBlue placeholder-middleBlue/50 outline-none focus:border-middleBlue"
        />
        <button
          type="submit"
          disabled={submitting}
          className="button flex w-full items-center justify-center gap-2 rounded-lg bg-darkBlue py-3 font-extrabold uppercase text-background transition-colors hover:bg-middleBlue disabled:opacity-50"
        >
          <FaPaperPlane /> {submitting ? "Enviando..." : "Solicitar reserva"}
        </button>
      </form>

      {cabin.whatsapp && (
        <a
          href={`https://wa.me/${cabin.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-success/60 py-2.5 font-bold text-success hover:bg-success/10"
        >
          <FaWhatsapp /> Consultar directo por WhatsApp
        </a>
      )}
    </div>
  );
};

export default BookingWidget;
