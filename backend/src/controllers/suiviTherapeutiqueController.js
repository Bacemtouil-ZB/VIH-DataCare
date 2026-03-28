import {
  getSuiviByPatient,
  getSuiviByNumero,

} from "../services/suiviTherapeutiqueService.js";


export const getSuiviByPatientController = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const suivis = await getSuiviByPatient(parseInt(patientId, 10));
    
    res.status(200).json({
      success: true,
      count: suivis.length,
      suivis,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSuiviByNumeroController = async (req, res) => {
  try {
    const { numeroDossier } = req.params;
    
    const suivis = await getSuiviByNumero(numeroDossier);
    
    res.status(200).json({
      success: true,
      count: suivis.length,
      suivis,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLastPerPatientController = async (req, res) => {
  try {
    const data = await getLastPrescriptionPerPatient();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
