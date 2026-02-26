import { getAllAddresses } from "../models/addresseModel.js";
export const fetchAllAddresses = async () => {
  try {
    const addresses = await getAllAddresses();
    return addresses;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw new Error("Failed to fetch addresses");
  }
};

// service/formDataService.js
import {
  getAllGovernorates,
  getAllPostalCodes,
} from "../model/formDataModel.js";

export const fetchFormData = async () => {
  const governorates = await getAllGovernorates();
  const postal_codes = await getAllPostalCodes();

  return { governorates, postal_codes };
};
