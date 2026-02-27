import {
  createSigneClinique as createSigneCliniqueService,
  getSigneCliniqueByNumeroDossier as getSigneCliniqueByNumeroDossierService,
  updateSigneClinique as updateSigneCliniqueService,
} from "../services/signeCliniqueService.js";

export const createSigneCliniqueController = async (req, res) => {
  try {
    const signeData = req.body;
    const signe = await createSigneCliniqueService(signeData);

    res.status(201).json({
      success: true,
      message: "Signe clinique créé avec succès",
      signe,
    });
  } catch (error) {
    console.error("Erreur createSigneClinique:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSigneCliniqueByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;

    const signes = await getSigneCliniqueByNumeroDossierService(numeroDossier);

    res.status(200).json({
      success: true,
      signes,
    });
  } catch (error) {
    console.error("Get signe clinique by numero dossier error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSigneCliniqueController = async (req, res) => {
  try {
    const { id } = req.params;
    const signeData = req.body;

    const signe = await updateSigneCliniqueService(parseInt(id), signeData);

    res.status(200).json({
      success: true,
      message: "Signe clinique mis à jour avec succès",
      signe,
    });
  } catch (error) {
    console.error("Update signe clinique error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};