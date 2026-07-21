import { FaWifi, FaParking, FaPaw, FaBed, FaTv, FaWheelchair } from "react-icons/fa";
import { MdPool, MdAcUnit, MdFireplace, MdOutdoorGrill, MdFreeBreakfast, MdHotTub, MdKitchen, MdSecurity } from "react-icons/md";
import { GiRiver } from "react-icons/gi";

export const AMENITY_ICONS = {
  pool: MdPool,
  wifi: FaWifi,
  ac: MdAcUnit,
  heating: MdFireplace,
  bbq: MdOutdoorGrill,
  parking: FaParking,
  pets: FaPaw,
  breakfast: MdFreeBreakfast,
  jacuzzi: MdHotTub,
  river: GiRiver,
  linens: FaBed,
  tv: FaTv,
  kitchen: MdKitchen,
  accessible: FaWheelchair,
  security: MdSecurity,
};

export const getAmenityIcon = (icon) => AMENITY_ICONS[icon] ?? MdPool;
