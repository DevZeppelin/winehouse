import { FaCrown } from "react-icons/fa";

const STYLES = {
  oro: "bg-gold-gradient text-background",
  plata: "bg-silver-gradient text-background",
  bronce: "bg-bronze-gradient text-background",
};

const PlanBadge = ({ slug, name, className = "" }) => {
  if (!slug) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide shadow-card ${
        STYLES[slug] ?? "bg-darkBlue text-background"
      } ${className}`}
    >
      <FaCrown className="text-[10px]" /> {name}
    </span>
  );
};

export default PlanBadge;
