import React, { createContext, useContext, useState, useCallback } from "react";
import * as patientService from "../services/patientService";

// Création du contexte
const PatientContext = createContext();

// Hook personnalisé
export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient doit être utilisé dans un PatientProvider");
  }
  return context;
};

// Provider du contexte
export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextNumero, setNextNumero] = useState(null);

  // ==========================================
  // OBTENIR LE PROCHAIN NUMÉRO DE DOSSIER
  // ==========================================
  const fetchNextNumero = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.getNextNumero();
      if (response.success) {
        setNextNumero(response.nextNumero);
        return response.nextNumero;
      }
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la récupération du numéro";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // CRÉER UN PATIENT
  // ==========================================
  const createPatient = useCallback(async (patientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.createPatient(patientData);
      if (response.success) {
        setPatients((prev) => [response.patient, ...prev]);
        return response.patient;
      }
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la création du patient";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // RÉCUPÉRER UN PATIENT PAR ID
  // ==========================================
  const getPatient = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.getPatientById(id);
      if (response.success) {
        setCurrentPatient(response.patient);
        return response.patient;
      }
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la récupération du patient";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // RÉCUPÉRER UN PATIENT PAR NUMÉRO
  // ==========================================
  const getPatientByNumero = useCallback(async (numero) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.getPatientByNumero(numero);
      if (response.success) {
        setCurrentPatient(response.patient);
        return response.patient;
      }
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la récupération du patient";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // VÉRIFIER SI UN NUMÉRO EXISTE (SANS AUTH)
  // ==========================================
  const checkNumeroExists = useCallback(async (numero) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.checkNumeroExists(numero);
      if (response.success) {
        return {
          exists: response.exists,
          patient: response.patient,
        };
      }
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la vérification";
      setError(errorMessage);
      return { exists: false, patient: null };
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // RÉCUPÉRER TOUS LES PATIENTS
  // ==========================================
  const getAllPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.getAllPatients();
      if (response.success) {
        setPatients(response.patients);
        return response.patients;
      }
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la récupération des patients";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // METTRE À JOUR UN PATIENT
  // ==========================================
  const updatePatient = useCallback(async (id, patientData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.updatePatient(id, patientData);
      if (response.success) {
        setPatients((prev) =>
          prev.map((p) => (p.id === id ? response.patient : p))
        );
        setCurrentPatient(response.patient);
        return response.patient;
      }
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la mise à jour";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // RECHERCHER DES PATIENTS
  // ==========================================
  const searchPatients = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.searchPatients(searchParams);
      if (response.success) {
        setPatients(response.patients);
        return response.patients;
      }
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la recherche";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // METTRE À JOUR LA DERNIÈRE VISITE
  // ==========================================
  const updateLastVisit = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.updateLastVisit(id);
      if (response.success) {
        setPatients((prev) =>
          prev.map((p) => (p.id === id ? response.patient : p))
        );
        return response.patient;
      }
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la mise à jour de la visite";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // SUPPRIMER UN PATIENT
  // ==========================================
  const deletePatient = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await patientService.deletePatient(id);
      if (response.success) {
        setPatients((prev) => prev.filter((p) => p.id !== id));
        if (currentPatient?.id === id) {
          setCurrentPatient(null);
        }
        return true;
      }
    } catch (err) {
      const errorMessage = err.message || "Erreur lors de la suppression";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPatient]);

  // ==========================================
  // RÉINITIALISER L'ÉTAT
  // ==========================================
  const resetState = useCallback(() => {
    setPatients([]);
    setCurrentPatient(null);
    setError(null);
    setNextNumero(null);
  }, []);

  // ==========================================
  // EFFACER LES ERREURS
  // ==========================================
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Valeur du contexte
  const value = {
    // État
    patients,
    currentPatient,
    loading,
    error,
    nextNumero,

    // Actions
    fetchNextNumero,
    createPatient,
    getPatient,
    getPatientByNumero,
    checkNumeroExists,
    getAllPatients,
    updatePatient,
    searchPatients,
    updateLastVisit,
    deletePatient,
    resetState,
    clearError,
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

export default PatientContext;