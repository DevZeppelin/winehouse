import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const inputClass =
  "w-full rounded-lg border border-surfaceBorder bg-surfaceLight px-3 py-2.5 text-lightBlue placeholder-middleBlue/50 outline-none focus:border-middleBlue";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Email o contraseña incorrectos");
      return;
    }
    toast.success("¡Bienvenido de nuevo!");
    navigate(location.state?.from?.pathname || "/panel", { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display mb-6 text-center text-3xl text-lightBlue">Ingresar</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-surfaceBorder bg-surface p-6 shadow-card">
        <input
          type="email"
          required
          placeholder="Email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="button w-full rounded-lg bg-orange py-3 font-extrabold uppercase text-background hover:bg-lightBlue disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-middleBlue">
        ¿No tenés cuenta?{" "}
        <Link to="/registro" className="font-bold text-orange hover:underline">
          Registrate
        </Link>
      </p>
    </div>
  );
};

export default Login;
