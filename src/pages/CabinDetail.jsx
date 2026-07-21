import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import { fetchCabinBySlug, fetchBookedDates } from "../lib/api";
import CabinGallery from "../components/cabin/CabinGallery";
import AmenitiesGrid from "../components/cabin/AmenitiesGrid";
import BookingWidget from "../components/cabin/BookingWidget";
import Spinner from "../components/ui/Spinner";

const CabinDetail = () => {
  const { slug } = useParams();
  const [cabin, setCabin] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const cabinData = await fetchCabinBySlug(slug);
      setCabin(cabinData);
      const dates = await fetchBookedDates(cabinData.id);
      setBookedDates(dates);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner />
      </div>
    );
  }

  if (notFound || !cabin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center text-lightBlue">
        <p className="text-xl">No encontramos esa cabaña.</p>
        <Link to="/" className="mt-4 inline-block font-bold text-orange hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const gallery = [cabin.cover_image, ...(cabin.gallery || [])].filter(
    (v, i, arr) => v && arr.indexOf(v) === i
  );
  const amenities = (cabin.cabin_amenities || []).map((ca) => ca.amenities).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-middleBlue hover:text-lightBlue">
        <FaArrowLeft /> Volver a cabañas
      </Link>

      <div className="mb-6">
        <p className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-orange">
          <FaMapMarkerAlt /> {cabin.region?.name}
        </p>
        <h1 className="font-display text-3xl text-lightBlue md:text-4xl">{cabin.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr,1fr]">
        <div className="space-y-8">
          <CabinGallery images={gallery} name={cabin.name} />

          <div className="flex flex-wrap gap-4 text-lightBlue">
            <span className="flex items-center gap-2 rounded-full bg-surfaceLight px-4 py-2">
              <FaUsers className="text-orange" /> Hasta {cabin.capacity} personas
            </span>
            <span className="flex items-center gap-2 rounded-full bg-surfaceLight px-4 py-2">
              <FaBed className="text-orange" /> {cabin.bedrooms} dormitorios
            </span>
            <span className="flex items-center gap-2 rounded-full bg-surfaceLight px-4 py-2">
              <FaBath className="text-orange" /> {cabin.bathrooms} baños
            </span>
          </div>

          <div>
            <h3 className="font-display mb-2 text-xl text-lightBlue">Sobre la cabaña</h3>
            <p className="whitespace-pre-line text-middleBlue">{cabin.description}</p>
            {cabin.address_hint && (
              <p className="mt-2 text-sm text-darkBlue">Ubicación: {cabin.address_hint}</p>
            )}
          </div>

          <AmenitiesGrid amenities={amenities} />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget cabin={cabin} bookedDates={bookedDates} onBooked={load} />
        </div>
      </div>
    </div>
  );
};

export default CabinDetail;
