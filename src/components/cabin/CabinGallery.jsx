import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CabinGallery = ({ images, name }) => {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const gallery = images.length ? images : ["/example.jpg"];

  const go = (delta) => setActive((a) => (a + delta + gallery.length) % gallery.length);

  return (
    <div>
      <div
        className="relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-2xl border border-surfaceBorder"
        onClick={() => setLightbox(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={gallery[active]}
            alt={`${name} — foto ${active + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === active ? "border-orange" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute right-5 top-5 text-3xl text-white"
              onClick={() => setLightbox(false)}
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>
            {gallery.length > 1 && (
              <button
                className="absolute left-3 text-3xl text-white md:left-8"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Anterior"
              >
                <FaChevronLeft />
              </button>
            )}
            <motion.img
              key={active}
              src={gallery[active]}
              alt={`${name} — foto ${active + 1}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {gallery.length > 1 && (
              <button
                className="absolute right-3 text-3xl text-white md:right-8"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Siguiente"
              >
                <FaChevronRight />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CabinGallery;
