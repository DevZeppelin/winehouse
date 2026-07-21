const CONFIGS = {
  cabin: {
    draft: { label: "Borrador", classes: "bg-surfaceBorder text-lightBlue" },
    pending_review: { label: "Pendiente de pago", classes: "bg-warning/20 text-warning" },
    published: { label: "Publicada", classes: "bg-success/20 text-success" },
    suspended: { label: "Suspendida", classes: "bg-danger/20 text-danger" },
  },
  subscription: {
    pending: { label: "Pendiente", classes: "bg-warning/20 text-warning" },
    active: { label: "Activa", classes: "bg-success/20 text-success" },
    expired: { label: "Vencida", classes: "bg-surfaceBorder text-middleBlue" },
    rejected: { label: "Rechazada", classes: "bg-danger/20 text-danger" },
  },
  booking: {
    pending: { label: "Pendiente", classes: "bg-warning/20 text-warning" },
    confirmed: { label: "Confirmada", classes: "bg-success/20 text-success" },
    cancelled: { label: "Cancelada", classes: "bg-danger/20 text-danger" },
  },
};

const StatusBadge = ({ type, status }) => {
  const config = CONFIGS[type]?.[status] ?? { label: status, classes: "bg-surfaceBorder text-lightBlue" };
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${config.classes}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
