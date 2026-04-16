import {
  fetchAllAddresses,
  fetchFormData,
} from "../services/addresseService.js";

export const listAllAddresses = async (req, res) => {
  try {
    const addresses = await fetchAllAddresses();
    res.json({ success: true, addresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const getFormData = async (req, res) => {
  try {
    const data = await fetchFormData();
    res.json({ success: true, ...data });
  } catch (error) {
    console.error("Erreur getFormData:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
