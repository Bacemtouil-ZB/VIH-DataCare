import {
  createHabitudeDeVie              as createService,
  getHabitudeDeVieById             as getByIdService,
  getHabitudeDeVieByNumeroDossier  as getByNumeroService,
  updateHabitudeDeVie              as updateService,
} from "../services/habitudeDeVieService.js";

export const createHabitudeDeVieController = async (req, res) => {
  try {
    const habitude = await createService(req.body);
    res.status(201).json({ success: true, habitude });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getHabitudeDeVieByIdController = async (req, res) => {
  try {
    const habitude = await getByIdService(parseInt(req.params.id));
    res.status(200).json({ success: true, habitude });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getHabitudeDeVieByNumeroDossierController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    const habitudes = await getByNumeroService(numeroDossier);
    res.status(200).json({ success: true, count: habitudes.length, habitudes });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateHabitudeDeVieController = async (req, res) => {
  try {
    const habitude = await updateService(parseInt(req.params.id), req.body);
    res.status(200).json({ success: true, habitude });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};