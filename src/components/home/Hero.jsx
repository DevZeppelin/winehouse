import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const Hero = ({ regions, region, onRegionChange }) => {
  const scrollToExplorar = (e) => {
    e.preventDefault();
    document.getElementById("explorar")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-hero-gradient px-4 pb-20 pt-16 text-center md:pb-28 md:pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto flex w-48 justify-center md:w-56"
      >
        <img src="/logo.png" alt="WineHouse Cabañas" className="w-full" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        className="font-display mx-auto mt-6 max-w-3xl text-3xl italic text-lightBlue sm:text-4xl md:text-5xl"
      >
        Tu próxima escapada a las montañas de{" "}
        <span className="text-gradient-gold not-italic">Mendoza</span> empieza acá
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mx-auto mt-4 max-w-xl text-base text-middleBlue md:text-lg"
      >
        Cabañas verificadas, con disponibilidad real y reserva directa con el dueño.
        Sin sorpresas.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 rounded-2xl glass-panel p-3 shadow-glow sm:flex-row sm:items-center"
      >
        <select
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          className="w-full flex-1 rounded-xl border border-surfaceBorder bg-surfaceLight px-4 py-3 text-lightBlue outline-none focus:border-middleBlue"
        >
          <option value="">Toda Mendoza</option>
          {regions.map((r) => (
            <option key={r.id} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>
        <a
          href="#explorar"
          onClick={scrollToExplorar}
          className="button flex items-center justify-center gap-2 rounded-xl bg-orange px-6 py-3 font-extrabold uppercase text-background transition-colors hover:bg-lightBlue"
        >
          <FaSearch /> Buscar
        </a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-3 text-xs uppercase tracking-widest text-darkBlue"
      >
        Por ahora en Mendoza · próximamente en toda Argentina
      </motion.p>
    </section>
  );
};

export default Hero;
