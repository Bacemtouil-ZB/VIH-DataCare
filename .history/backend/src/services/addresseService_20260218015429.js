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
