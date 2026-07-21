import { motion } from "framer-motion";
import { getAmenityIcon } from "../../lib/amenityIcons";

const AmenitiesGrid = ({ amenities }) => {
  if (!amenities.length) return null;

  return (
    <div>
      <h3 className="font-display mb-3 text-xl text-lightBlue">Lo que tiene la cabaña</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {amenities.map((a, i) => {
          const Icon = getAmenityIcon(a.icon);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-2 rounded-xl border border-surfaceBorder bg-surfaceLight px-3 py-2.5 text-sm text-lightBlue"
            >
              <Icon className="shrink-0 text-lg text-orange" />
              {a.label}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AmenitiesGrid;
