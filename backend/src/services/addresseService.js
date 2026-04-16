//cheked 15/04/2026
import {
  getAllGovernorates,
  getAllPostalCodes,
  getAllAddresses,
} from "../models/addresseModel.js";

export const fetchAllAddresses = async () => {
  try {
    const addresses = await getAllAddresses();
    return addresses;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw new Error("Failed to fetch addresses");
  }
};

export const fetchFormData = async () => {
  const governorates = await getAllGovernorates();
  const postal_codes = await getAllPostalCodes();

  return { governorates, postal_codes };
};
