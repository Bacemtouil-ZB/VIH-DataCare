import { getAllAddresses } from "../services/addressService.js";

export const listAllAddresses = async (req, res) => {
  try {
    const addresses = await getAllAddresses();
    res.json({ success: true, addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
