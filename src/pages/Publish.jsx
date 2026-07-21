import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCloudUploadAlt, FaTimes, FaCheckCircle, FaCopy } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import {
  fetchRegions,
  fetchAmenities,
  fetchPlans,
  createCabin,
  uploadCabinImage,
  requestSubscription,
  uploadPaymentProof,
  attachPaymentProof,
} from "../lib/api";
import { getAmenityIcon } from "../lib/amenityIcons";
import StepIndicator from "../components/owner/StepIndicator";
import PlanBadge from "../components/ui/PlanBadge";

const inputClass =
  "w-full rounded-lg border border-surfaceBorder bg-surfaceLight px-3 py-2.5 text-lightBlue placeholder-middleBlue/50 outline-none focus:border-middleBlue";
const labelClass = "mb-1 block text-xs font-bold uppercase tracking-wide text-middleBlue";

const Publish = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [regions, setRegions] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [result, setResult] = useState(null); // { cabin, subscription, plan }

  const [form, setForm] = useState({
    name: "",
    description: "",
    regionId: "",
    addressHint: "",
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    pricePerNight: "",
    whatsapp: "",
    email: user?.email || "",
    amenityIds: [],
    imageFiles: [],
    planId: null,
  });

  useEffect(() => {
    fetchRegions().then(setRegions).catch(() => setRegions([]));
    fetchAmenities().then(setAmenities).catch(() => setAmenities([]));
    fetchPlans().then((p) => {
      setPlans(p);
      setForm((f) => ({ ...f, planId: f.planId ?? p[1]?.id ?? p[0]?.id }));
    }).catch(() => setPlans([]));
  }, []);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const toggleAmenity = (id) =>
    setForm((f) => ({
      ...f,
      amenityIds: f.amenityIds.includes(id)
        ? f.amenityIds.filter((a) => a !== id)
        : [...f.amenityIds, id],
    }));

  const validateStep1 = () => {
    if (!form.name.trim()) return "Ingresá el nombre de tu cabaña";
    if (!form.description.trim()) return "Contanos algo sobre tu cabaña";
    if (!form.regionId) return "Elegí la región";
    if (!form.pricePerNight || Number(form.pricePerNight) <= 0) return "Ingresá un precio por noche válido";
    return null;
  };

  const goNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) return toast.error(err);
    }
    if (step === 3 && form.imageFiles.length === 0) {
      return toast.error("Subí al menos una foto de tu cabaña");
    }
    setStep((s) => s + 1);
  };

  const handleFiles = (files) => {
    const arr = Array.from(files).slice(0, 15);
    update({ imageFiles: [...form.imageFiles, ...arr].slice(0, 15) });
  };

  const removeImage = (idx) =>
    update({ imageFiles: form.imageFiles.filter((_, i) => i !== idx) });

  const handlePublish = async () => {
    if (!form.planId) return toast.error("Elegí un plan de suscripción");
    setSaving(true);
    try {
      const urls = [];
      for (const file of form.imageFiles) {
        urls.push(await uploadCabinImage(file, user.id));
      }
      const cabin = await createCabin({
        ownerId: user.id,
        name: form.name,
        description: form.description,
        regionId: Number(form.regionId),
        addressHint: form.addressHint,
        capacity: Number(form.capacity),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        pricePerNight: Number(form.pricePerNight),
        whatsapp: form.whatsapp,
        email: form.email,
        coverImage: urls[0],
        gallery: urls.slice(1),
        amenityIds: form.amenityIds,
      });
      const subscription = await requestSubscription({ cabinId: cabin.id, planId: form.planId });
      const plan = plans.find((p) => p.id === form.planId);
      setResult({ cabin, subscription, plan });
      toast.success("¡Tu cabaña fue creada!");
      setStep(5);
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al publicar. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleProofUpload = async (file) => {
    if (!file || !result) return;
    setUploadingProof(true);
    try {
      const path = await uploadPaymentProof(file, user.id);
      await attachPaymentProof({ subscriptionId: result.subscription.id, proofPath: path });
      setProofUploaded(true);
      toast.success("Comprobante subido, ¡gracias!");
    } catch {
      toast.error("No pudimos subir el comprobante");
    } finally {
      setUploadingProof(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="font-display mb-2 text-center text-3xl text-lightBlue">Publicá tu cabaña</h1>
      <p className="mb-8 text-center text-middleBlue">
        Cargá los datos, elegí tu plan y empezá a recibir reservas.
      </p>

      {step <= 4 && <StepIndicator step={step} />}

      <div className="rounded-2xl border border-surfaceBorder bg-surface p-5 shadow-card md:p-8">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nombre de la cabaña</label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Ej: Cabaña El Refugio"
              />
            </div>
            <div>
              <label className={labelClass}>Descripción</label>
              <textarea
                className={inputClass}
                rows={4}
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Contales a tus huéspedes qué hace especial a tu cabaña"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Región</label>
                <select
                  className={inputClass}
                  value={form.regionId}
                  onChange={(e) => update({ regionId: e.target.value })}
                >
                  <option value="">Elegí una región</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Referencia de ubicación (opcional)</label>
                <input
                  className={inputClass}
                  value={form.addressHint}
                  onChange={(e) => update({ addressHint: e.target.value })}
                  placeholder="Ej: A 5 min del centro"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Capacidad</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={form.capacity}
                  onChange={(e) => update({ capacity: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Dormitorios</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={form.bedrooms}
                  onChange={(e) => update({ bedrooms: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Baños</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={form.bathrooms}
                  onChange={(e) => update({ bathrooms: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Precio por noche (ARS)</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={form.pricePerNight}
                  onChange={(e) => update({ pricePerNight: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>WhatsApp de contacto</label>
                <input
                  className={inputClass}
                  value={form.whatsapp}
                  onChange={(e) => update({ whatsapp: e.target.value })}
                  placeholder="549261..."
                />
              </div>
              <div>
                <label className={labelClass}>Email de contacto</label>
                <input
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-4 text-middleBlue">Elegí las comodidades que ofrece tu cabaña.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {amenities.map((a) => {
                const Icon = getAmenityIcon(a.icon);
                const checked = form.amenityIds.includes(a.id);
                return (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => toggleAmenity(a.id)}
                    className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition-colors ${
                      checked
                        ? "border-orange bg-orange/10 text-lightBlue"
                        : "border-surfaceBorder text-middleBlue hover:border-darkBlue"
                    }`}
                  >
                    <Icon className="shrink-0 text-lg text-orange" />
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-4 text-middleBlue">
              Subí fotos de tu cabaña (la primera va a ser la foto de portada).
            </p>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-surfaceBorder py-10 text-middleBlue hover:border-middleBlue">
              <FaCloudUploadAlt className="text-3xl" />
              Hacé clic para elegir fotos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>

            {form.imageFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {form.imageFiles.map((file, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-orange px-1.5 py-0.5 text-[10px] font-black text-background">
                        Portada
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="mb-4 text-middleBlue">
              Elegí el plan de suscripción mensual. A mayor plan, más arriba aparece tu cabaña en
              el listado.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {plans.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => update({ planId: p.id })}
                  className={`flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-transform hover:-translate-y-1 ${
                    form.planId === p.id
                      ? "border-orange bg-orange/10"
                      : "border-surfaceBorder"
                  }`}
                >
                  <PlanBadge slug={p.slug} name={p.name} />
                  <p className="text-2xl font-black text-lightBlue">
                    ${Number(p.price_ars).toLocaleString("es-AR")}
                    <span className="text-sm font-normal text-middleBlue">/mes</span>
                  </p>
                  <ul className="space-y-1 text-xs text-middleBlue">
                    {p.features.map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handlePublish}
              className="button mt-6 w-full rounded-lg bg-orange py-3 font-extrabold uppercase text-background transition-colors hover:bg-lightBlue disabled:opacity-50"
            >
              {saving ? "Publicando..." : "Publicar cabaña"}
            </button>
          </div>
        )}

        {step === 5 && result && (
          <div className="space-y-5 text-center">
            <FaCheckCircle className="mx-auto text-5xl text-success" />
            <h2 className="font-display text-2xl text-lightBlue">¡Ya casi está lista!</h2>
            <p className="text-middleBlue">
              Tu cabaña <strong className="text-lightBlue">{result.cabin.name}</strong> quedó
              creada. Para publicarla activá el plan{" "}
              <strong className="text-lightBlue">{result.plan?.name}</strong> transfiriendo{" "}
              <strong className="text-orange">
                ${Number(result.plan?.price_ars).toLocaleString("es-AR")}
              </strong>{" "}
              a estos datos:
            </p>

            <div className="mx-auto max-w-sm space-y-2 rounded-xl bg-surfaceLight p-4 text-left text-sm">
              {[
                ["Alias", import.meta.env.VITE_BANK_ALIAS],
                ["CBU", import.meta.env.VITE_BANK_CBU],
                ["Titular", import.meta.env.VITE_BANK_HOLDER],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span>
                      <span className="text-middleBlue">{label}: </span>
                      <span className="font-bold text-lightBlue">{value}</span>
                    </span>
                    <button onClick={() => copy(value)} className="text-middleBlue hover:text-orange">
                      <FaCopy />
                    </button>
                  </div>
                ) : null
              )}
            </div>

            <div>
              <label className="mx-auto flex max-w-sm cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-surfaceBorder py-6 text-sm text-middleBlue hover:border-middleBlue">
                <FaCloudUploadAlt className="text-2xl" />
                {proofUploaded ? "Comprobante subido ✔" : "Subir comprobante de transferencia (opcional)"}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  disabled={uploadingProof}
                  onChange={(e) => handleProofUpload(e.target.files?.[0])}
                />
              </label>
            </div>

            <p className="text-xs text-darkBlue">
              En cuanto confirmemos el pago, tu cabaña se publica automáticamente. Podés seguir el
              estado desde tu panel.
            </p>

            <button
              onClick={() => navigate("/panel")}
              className="button mx-auto w-full max-w-sm rounded-lg bg-darkBlue py-3 font-extrabold uppercase text-background hover:bg-middleBlue"
            >
              Ir a mi panel
            </button>
          </div>
        )}
      </div>

      {step <= 4 && (
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="rounded-lg border-2 border-darkBlue px-5 py-2 font-bold uppercase text-lightBlue disabled:opacity-30"
          >
            Atrás
          </button>
          {step < 4 && (
            <button
              onClick={goNext}
              className="button rounded-lg bg-darkBlue px-6 py-2 font-bold uppercase text-background hover:bg-middleBlue"
            >
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Publish;
