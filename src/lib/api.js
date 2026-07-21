import { supabase } from "./supabaseClient";

const slugify = (text) =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const makeCabinSlug = (name) =>
  `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;

// ---------------------------------------------------------------------------
// Catálogos
// ---------------------------------------------------------------------------
export async function fetchRegions() {
  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function fetchAmenities() {
  const { data, error } = await supabase.from("amenities").select("*").order("label");
  if (error) throw error;
  return data;
}

export async function fetchPlans() {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("active", true)
    .order("weight");
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Cabañas públicas
// ---------------------------------------------------------------------------
export async function fetchPublishedCabins({ regionSlug } = {}) {
  let query = supabase
    .from("published_cabins")
    .select("*")
    .order("plan_weight", { ascending: false, nullsFirst: false })
    .order("subscription_since", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (regionSlug) query = query.eq("region_slug", regionSlug);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchCabinBySlug(slug) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*, region:regions(name, slug, province), cabin_amenities(amenities(*))")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchBookedDates(cabinId) {
  const { data, error } = await supabase
    .from("cabin_booked_dates")
    .select("check_in, check_out")
    .eq("cabin_id", cabinId);
  if (error) throw error;
  return data;
}

export async function createBookingRequest({
  cabinId,
  guestName,
  guestPhone,
  guestEmail,
  checkIn,
  checkOut,
  message,
}) {
  const { error } = await supabase.from("bookings").insert({
    cabin_id: cabinId,
    guest_name: guestName,
    guest_phone: guestPhone,
    guest_email: guestEmail || null,
    check_in: checkIn,
    check_out: checkOut,
    message: message || null,
  });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------
export async function uploadCabinImage(file, ownerId) {
  const path = `${ownerId}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("cabin-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("cabin-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadPaymentProof(file, ownerId) {
  const path = `${ownerId}/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from("payment-proofs").upload(path, file);
  if (error) throw error;
  return path;
}

export async function fetchPaymentProofSignedUrl(path) {
  const { data, error } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(path, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}

// ---------------------------------------------------------------------------
// Dueño de cabaña
// ---------------------------------------------------------------------------
export async function createCabin({
  ownerId,
  name,
  description,
  regionId,
  addressHint,
  capacity,
  bedrooms,
  bathrooms,
  pricePerNight,
  whatsapp,
  email,
  coverImage,
  gallery,
  amenityIds,
}) {
  const { data: cabin, error } = await supabase
    .from("cabins")
    .insert({
      owner_id: ownerId,
      name,
      slug: makeCabinSlug(name),
      description,
      region_id: regionId,
      address_hint: addressHint || null,
      capacity,
      bedrooms,
      bathrooms,
      price_per_night: pricePerNight,
      whatsapp: whatsapp || null,
      email: email || null,
      cover_image: coverImage || null,
      gallery: gallery || [],
      status: "pending_review",
    })
    .select()
    .single();
  if (error) throw error;

  if (amenityIds?.length) {
    const rows = amenityIds.map((amenity_id) => ({ cabin_id: cabin.id, amenity_id }));
    const { error: amenityError } = await supabase.from("cabin_amenities").insert(rows);
    if (amenityError) throw amenityError;
  }

  return cabin;
}

export async function fetchOwnerCabins(ownerId) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*, region:regions(name), subscriptions(*, plan:subscription_plans(*))")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchCabinBookings(cabinId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabin_id", cabinId)
    .order("check_in", { ascending: true });
  if (error) throw error;
  return data;
}

export async function updateBookingStatus(bookingId, status) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
  if (error) throw error;
}

export async function requestSubscription({ cabinId, planId }) {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert({ cabin_id: cabinId, plan_id: planId, status: "pending" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function attachPaymentProof({ subscriptionId, proofPath }) {
  const { error } = await supabase
    .from("subscriptions")
    .update({ payment_proof_url: proofPath })
    .eq("id", subscriptionId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Administración
// ---------------------------------------------------------------------------
export async function fetchPendingSubscriptions() {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, cabin:cabins(name, slug, owner_id, owner:profiles(full_name, phone)), plan:subscription_plans(*)")
    .eq("status", "pending")
    .order("requested_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function approveSubscription(subscriptionId) {
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "active" })
    .eq("id", subscriptionId);
  if (error) throw error;
}

export async function rejectSubscription(subscriptionId) {
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "rejected" })
    .eq("id", subscriptionId);
  if (error) throw error;
}

export async function fetchAllCabinsAdmin() {
  const { data, error } = await supabase
    .from("cabins")
    .select("*, region:regions(name), owner:profiles(full_name, phone)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateCabinStatusAdmin(cabinId, status) {
  const { error } = await supabase.from("cabins").update({ status }).eq("id", cabinId);
  if (error) throw error;
}
