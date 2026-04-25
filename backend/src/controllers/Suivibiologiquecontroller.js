import {
  getKpis,
  getGraphiqueCD4,
  getGraphiqueCV,
  getPeriodesARV,
  getTableau,
} from "../services/Suivibiologiqueservice.js";
import { logAction } from "../services/auditService.js";

// ── Zone 1 — KPIs + alertes ──────────────────────────────────────────────────
export const getKpisController = async (req, res) => {
  try {
    const { numero } = req.params;
    const data = await getKpis(numero);
    await logAction(req, {
      module: "SUIVI_BIOLOGIQUE",
      action: "SUIVI_BIOLOGIQUE_KPIS_VIEW",
      entity_id: null,
      old_data: null,
      new_data: { numero },
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── Zone 2 — Graphique CD4 ───────────────────────────────────────────────────
export const getGraphiqueCD4Controller = async (req, res) => {
  try {
    const { numero } = req.params;
    const data = await getGraphiqueCD4(numero);
    await logAction(req, {
      module: "SUIVI_BIOLOGIQUE",
      action: "SUIVI_BIOLOGIQUE_CD4_VIEW",
      entity_id: null,
      old_data: null,
      new_data: { numero },
    });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── Zone 2 — Graphique CV ────────────────────────────────────────────────────
export const getGraphiqueCVController = async (req, res) => {
  try {
    const { numero } = req.params;
    const data = await getGraphiqueCV(numero);
    await logAction(req, {
      module: "SUIVI_BIOLOGIQUE",
      action: "SUIVI_BIOLOGIQUE_CV_VIEW",
      entity_id: null,
      old_data: null,
      new_data: { numero },
    });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── Zone 2 — Périodes ARV ────────────────────────────────────────────────────
export const getPeriodesARVController = async (req, res) => {
  try {
    const { numero } = req.params;
    const data = await getPeriodesARV(numero);
    await logAction(req, {
      module: "SUIVI_BIOLOGIQUE",
      action: "SUIVI_BIOLOGIQUE_PERIODES_ARV_VIEW",
      entity_id: null,
      old_data: null,
      new_data: { numero },
    });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ── Zone 3 — Tableau chronologique ───────────────────────────────────────────
export const getTableauController = async (req, res) => {
  try {
    const { numero } = req.params;
    const data = await getTableau(numero);
    await logAction(req, {
      module: "SUIVI_BIOLOGIQUE",
      action: "SUIVI_BIOLOGIQUE_TABLEAU_VIEW",
      entity_id: null,
      old_data: null,
      new_data: { numero },
    });
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
