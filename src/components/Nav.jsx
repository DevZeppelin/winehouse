import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const navLinkClass = ({ isActive }) =>
  `transition-colors hover:text-lightBlue ${isActive ? "text-lightBlue" : "text-middleBlue"}`;

const Nav = () => {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-surfaceBorder bg-background/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="WineHouse Cabañas" className="h-10 w-auto" />
        </Link>

        <div className="hidden items-center gap-6 text-sm font-bold uppercase tracking-wide md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Inicio
          </NavLink>
          <NavLink to="/#explorar" className={navLinkClass}>
            Cabañas
          </NavLink>
          <NavLink to="/publicar" className={navLinkClass}>
            Publicá tu cabaña
          </NavLink>

          {user ? (
            <div className="flex items-center gap-4">
              <NavLink to={profile?.role === "admin" ? "/admin" : "/panel"} className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <FaUserCircle /> {profile?.role === "admin" ? "Admin" : "Mi panel"}
                </span>
              </NavLink>
              <button
                onClick={handleSignOut}
                className="rounded-lg border-2 border-darkBlue px-3 py-1.5 normal-case text-lightBlue hover:bg-darkBlue hover:text-background"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/ingresar"
              className="rounded-lg bg-darkBlue px-4 py-1.5 text-background hover:bg-middleBlue"
            >
              Ingresar
            </Link>
          )}
        </div>

        <button
          className="text-2xl text-lightBlue md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-surfaceBorder bg-background px-4 pb-4 pt-2 text-sm font-bold uppercase tracking-wide md:hidden">
          <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>
            Inicio
          </NavLink>
          <NavLink to="/#explorar" className={navLinkClass} onClick={() => setOpen(false)}>
            Cabañas
          </NavLink>
          <NavLink to="/publicar" className={navLinkClass} onClick={() => setOpen(false)}>
            Publicá tu cabaña
          </NavLink>
          {user ? (
            <>
              <NavLink to={profile?.role === "admin" ? "/admin" : "/panel"} className={navLinkClass} onClick={() => setOpen(false)}>
                {profile?.role === "admin" ? "Admin" : "Mi panel"}
              </NavLink>
              <button onClick={handleSignOut} className="py-1 text-left text-lightBlue">
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/ingresar" className={navLinkClass} onClick={() => setOpen(false)}>
              Ingresar
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
};

export default Nav;
