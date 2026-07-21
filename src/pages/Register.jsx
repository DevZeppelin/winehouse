import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const inputClass =
  "w-full rounded-lg border border-surfaceBorder bg-surfaceLight px-3 py-2.5 text-lightBlue placeholder-middleBlue/50 outline-none focus:border-middleBlue";

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    const { data, error } = await signUp(form);
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("registered") ? "Ese email ya está registrado" : "No pudimos crear tu cuenta");
      return;
    }
    if (data.session) {
      toast.success("¡Cuenta creada!");
      navigate("/panel");
    } else {
      toast.success("Revisá tu email para confirmar la cuenta");
      navigate("/ingresar");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display mb-6 text-center text-3xl text-lightBlue">Creá tu cuenta</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-surfaceBorder bg-surface p-6 shadow-card">
        <input
          required
          placeholder="Nombre completo"
          className={inputClass}
          value={form.fullName}
          onChange={(e) => update({ fullName: e.target.value })}
        />
        <input
          placeholder="Teléfono"
          className={inputClass}
          value={form.phone}
          onChange={(e) => update({ phone: e.target.value })}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className={inputClass}
          value={form.email}
          onChange={(e) => update({ email: e.target.value })}
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
          className={inputClass}
          value={form.password}
          onChange={(e) => update({ password: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="button w-full rounded-lg bg-orange py-3 font-extrabold uppercase text-background hover:bg-lightBlue disabled:opacity-50"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-middleBlue">
        ¿Ya tenés cuenta?{" "}
        <Link to="/ingresar" className="font-bold text-orange hover:underline">
          Ingresá
        </Link>
      </p>
    </div>
  );
};

export default Register;
