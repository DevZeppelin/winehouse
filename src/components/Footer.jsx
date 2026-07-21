import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const whatsapp = import.meta.env.VITE_WHATSAPP_CONTACTO;

  return (
    <footer className="mt-24 border-t border-surfaceBorder bg-surface/60">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 text-sm text-middleBlue md:grid-cols-3">
        <div>
          <img src="/logo.png" alt="WineHouse Cabañas" className="mb-3 h-10 w-auto" />
          <p>
            El lugar donde encontrar tu próxima escapada a las montañas de Mendoza,
            con disponibilidad real y sin vueltas.
          </p>
        </div>

        <div>
          <p className="mb-3 font-bold uppercase tracking-wide text-lightBlue">Explorar</p>
          <ul className="space-y-2">
            <li>
              <Link to="/#explorar" className="hover:text-lightBlue">
                Ver cabañas
              </Link>
            </li>
            <li>
              <Link to="/publicar" className="hover:text-lightBlue">
                Publicá tu cabaña
              </Link>
            </li>
            <li>
              <Link to="/ingresar" className="hover:text-lightBlue">
                Ingresar
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-bold uppercase tracking-wide text-lightBlue">Contacto</p>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-lightBlue"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          )}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center gap-2 hover:text-lightBlue"
          >
            <FaInstagram /> Instagram
          </a>
        </div>
      </div>

      <div className="border-t border-surfaceBorder py-4 text-center text-xs text-darkBlue">
        Web desarrollada por{" "}
        <a
          href="https://www.devzeppelin.ar"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-lightBlue"
        >
          DevZeppelin
        </a>
        . Todos los derechos reservados. {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;
