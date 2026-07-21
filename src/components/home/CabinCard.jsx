import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUsers, FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import PlanBadge from "../ui/PlanBadge";

const CabinCard = ({ cabin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-surfaceBorder bg-surface shadow-card"
    >
      <Link to={`/cabanas/${cabin.slug}`}>
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={cabin.cover_image || "/example.jpg"}
            alt={cabin.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />

          {cabin.plan_slug && (
            <PlanBadge
              slug={cabin.plan_slug}
              name={cabin.plan_name}
              className="absolute right-3 top-3"
            />
          )}

          <div className="absolute bottom-3 left-3 right-3">
            <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-lightBlue drop-shadow">
              <FaMapMarkerAlt className="text-orange" /> {cabin.region_name}
            </p>
            <h3 className="font-display truncate text-xl font-bold text-white drop-shadow">
              {cabin.name}
            </h3>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <p className="line-clamp-2 h-10 text-sm text-middleBlue">{cabin.description}</p>

          <div className="flex items-center gap-4 text-xs text-lightBlue">
            <span className="flex items-center gap-1">
              <FaUsers /> {cabin.capacity}
            </span>
            <span className="flex items-center gap-1">
              <FaBed /> {cabin.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <FaBath /> {cabin.bathrooms}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-surfaceLight px-3 py-2">
            <span className="text-xs uppercase text-middleBlue">Por noche</span>
            <span className="text-xl font-black text-orange">
              ${Number(cabin.price_per_night).toLocaleString("es-AR")}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CabinCard;
