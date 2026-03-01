import asyncHandler from "../middlewares/asyncHandler.js";
import {
  getActiveHeader,
  createNewVersion,
  getActiveMedical,
  putActiveMedical,
  getActiveInfectious,
  putActiveInfectious,
  getActiveTherapeutic,
  putActiveTherapeutic,
  getActiveFamily,
  putActiveFamily,
  getActiveGyneco,
  putActiveGyneco,
  getActiveSurgical,
  putActiveSurgical,
  getActiveTransfusion,
  putActiveTransfusion,
  getActiveAes,
  putActiveAes,
} from "../services/antecedentService.js";

// Header
export const getActiveAntecedentHeader = asyncHandler(async (req, res) => {
  const data = await getActiveHeader(req.params.numero);
  res.json(data);
});

export const postNewAntecedentVersion = asyncHandler(async (req, res) => {
  const created = await createNewVersion(req.params.numero, req.user.id);
  res.status(201).json(created);
});

// 1-1 sections
export const getMedical = asyncHandler(async (req, res) => {
  res.json(await getActiveMedical(req.params.numero));
});
export const putMedical = asyncHandler(async (req, res) => {
  res.json(await putActiveMedical(req.params.numero, req.body, req.user.id));
});

export const getInfectious = asyncHandler(async (req, res) => {
  res.json(await getActiveInfectious(req.params.numero));
});
export const putInfectious = asyncHandler(async (req, res) => {
  res.json(await putActiveInfectious(req.params.numero, req.body, req.user.id));
});

export const getTherapeutic = asyncHandler(async (req, res) => {
  res.json(await getActiveTherapeutic(req.params.numero));
});
export const putTherapeutic = asyncHandler(async (req, res) => {
  res.json(
    await putActiveTherapeutic(req.params.numero, req.body, req.user.id),
  );
});

export const getFamily = asyncHandler(async (req, res) => {
  res.json(await getActiveFamily(req.params.numero));
});
export const putFamily = asyncHandler(async (req, res) => {
  res.json(await putActiveFamily(req.params.numero, req.body, req.user.id));
});

export const getGyneco = asyncHandler(async (req, res) => {
  res.json(await getActiveGyneco(req.params.numero));
});
// export const putGyneco = asyncHandler(async (req, res) => {
//   res.json(await putActiveGyneco(req.params.numero, req.body, req.user.id));
// });

export const putGyneco = asyncHandler(async (req, res) => {
  try {
    const result = await putActiveGyneco(
      req.params.numero,
      req.body,
      req.user.id,
    );
    res.json(result);
  } catch (err) {
    // Postgres common errors:
    // 23514 = check_violation (ex: (parite+avortement) <= gestite)
    // 22P02 = invalid_text_representation (ex: "" pour integer)
    if (err?.code === "23514") {
      return res.status(400).json({
        message:
          "Données gynéco invalides: parité + avortement doit être ≤ gestité.",
        code: err.code,
        detail: err.detail || null,
        constraint: err.constraint || null,
      });
    }

    if (err?.code === "22P02") {
      return res.status(400).json({
        message:
          "Données gynéco invalides: gestité/parité/avortement doivent être des nombres (ou null).",
        code: err.code,
        detail: err.detail || null,
      });
    }

    // not_null_violation
    if (err?.code === "23502") {
      return res.status(400).json({
        message: "Champs requis manquant.",
        code: err.code,
        detail: err.detail || null,
        column: err.column || null,
      });
    }

    // default: internal error
    console.error("putGyneco error:", err);
    return res.status(500).json({
      message: "Erreur serveur lors de l'enregistrement gynéco.",
      code: err?.code || null,
    });
  }
});

// 1-N sections (replace lists)
export const getSurgical = asyncHandler(async (req, res) => {
  res.json(await getActiveSurgical(req.params.numero));
});
export const putSurgical = asyncHandler(async (req, res) => {
  // body doit être un tableau
  res.json(await putActiveSurgical(req.params.numero, req.body, req.user.id));
});

export const getTransfusion = asyncHandler(async (req, res) => {
  res.json(await getActiveTransfusion(req.params.numero));
});
export const putTransfusion = asyncHandler(async (req, res) => {
  res.json(
    await putActiveTransfusion(req.params.numero, req.body, req.user.id),
  );
});

export const getAes = asyncHandler(async (req, res) => {
  res.json(await getActiveAes(req.params.numero));
});
export const putAes = asyncHandler(async (req, res) => {
  res.json(await putActiveAes(req.params.numero, req.body, req.user.id));
});
