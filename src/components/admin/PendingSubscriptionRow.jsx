import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaFileInvoiceDollar } from "react-icons/fa";
import PlanBadge from "../ui/PlanBadge";
import { approveSubscription, rejectSubscription, fetchPaymentProofSignedUrl } from "../../lib/api";

const PendingSubscriptionRow = ({ subscription, onResolved }) => {
  const [busy, setBusy] = useState(false);

  const act = async (action) => {
    setBusy(true);
    try {
      if (action === "approve") await approveSubscription(subscription.id);
      else await rejectSubscription(subscription.id);
      toast.success(action === "approve" ? "Suscripción activada, la cabaña ya está publicada" : "Suscripción rechazada");
      onResolved(subscription.id);
    } catch {
      toast.error("No pudimos actualizar la suscripción");
    } finally {
      setBusy(false);
    }
  };

  const viewProof = async () => {
    if (!subscription.payment_proof_url) return toast.error("El dueño todavía no subió comprobante");
    try {
      const url = await fetchPaymentProofSignedUrl(subscription.payment_proof_url);
      window.open(url, "_blank");
    } catch {
      toast.error("No pudimos abrir el comprobante");
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surfaceBorder bg-surfaceLight p-4">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-bold text-lightBlue">{subscription.cabin?.name}</p>
          <PlanBadge slug={subscription.plan?.slug} name={subscription.plan?.name} />
        </div>
        <p className="text-sm text-middleBlue">
          {subscription.cabin?.owner?.full_name} · {subscription.cabin?.owner?.phone} · $
          {Number(subscription.plan?.price_ars).toLocaleString("es-AR")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={viewProof}
          className="flex items-center gap-1 rounded-lg border-2 border-darkBlue px-3 py-1.5 text-sm font-bold text-lightBlue hover:bg-darkBlue"
        >
          <FaFileInvoiceDollar /> Comprobante
        </button>
        <button
          disabled={busy}
          onClick={() => act("approve")}
          className="rounded-full bg-success/20 p-2 text-success hover:bg-success/30 disabled:opacity-50"
          title="Aprobar"
        >
          <FaCheck />
        </button>
        <button
          disabled={busy}
          onClick={() => act("reject")}
          className="rounded-full bg-danger/20 p-2 text-danger hover:bg-danger/30 disabled:opacity-50"
          title="Rechazar"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default PendingSubscriptionRow;
