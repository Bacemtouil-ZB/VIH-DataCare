import { Navigate } from "react-router-dom";
import NewPatientGuard from "./NewPatientGuard.jsx";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import { DashboardLayout } from "../../../shared/components";
import PatientsPage from "../pages/patientsPage/PatientsPage";
import ProfilPage from "../../../pages/parametres/profile";
import MainWorkspaceLayout from "../pages/MainWorkspaceLayout";
import ExamenLayout from "../pages/workspace/Examen_cliniques/ExamenClinique/ExamenLayout.jsx";
import ObservationPage from "../pages/workspace/Examen_cliniques/Observation/ObservationPage.jsx";
import ObservancePage from "../pages/workspace/Examen_cliniques/observance/observancePage.jsx";
import Profilpage from "../pages/workspace/Profil/ProfilPageWorkspace"
import Social from "../pages/workspace/Social/SocialFormPage.jsx";
import VIH from "../pages/workspace/VIH/VIH";
import Antecedent from "../pages/workspace/Antecedents/AntecedentsLayout.jsx";
import MedicalOrchestrer from "../pages/workspace/Antecedents/medical/MedicalOrchestrer.jsx";
import FamilyOrchestrer from "../pages/workspace/Antecedents/family/FamilyOrchestrer.jsx";
import GynecoOrchestrer from "../pages/workspace/Antecedents/gyneco/GynecoOrchestrer.jsx";
import TherapeuticOrchestrer from "../pages/workspace/Antecedents/therapeutic/TherapeuticOrchestrer.jsx";
import HabitudesVieOrchestrer from "../pages/workspace/Antecedents/habitudesVie/HabitudesVieOrchestrer.jsx";
import SurgicalOrchestrer from "../pages/workspace/Antecedents/surgical/SurgicalOrchestrer.jsx";
import TransfusionOrchestrer from "../pages/workspace/Antecedents/transfusion/TransfusionOrchestrer.jsx";
import TpePrepOrchestrer from "../pages/workspace/Antecedents/tpePrep/TpePrepOrchestrer.jsx";
import SignesFonctionnels from "../pages/workspace/Examen_cliniques/SigneFonction/SignesFonctionnels.jsx";
import SignesCliniques from "../pages/workspace/Examen_cliniques/signeClinique/SignesCliniques.jsx";
import ResultatsBiologiques from'../pages/workspace/resultats_biologiques/ResultatsBiologiques.jsx';
import GenotypagePage from "../pages/workspace/resultats_biologiques/GenotypagePage.jsx";
import PrescriptionExamens from "../pages/workspace/prescreption_dexamens/PrescriptionExamens";
import PrescreptionMedical from "../pages/workspace/prescreption_medical/PrescreptionMedical";
import Conclusion from "../pages/workspace/conclusion/Conclusion";
import SuiviLayout from "../pages/workspace/suivi/SuiviLayout";
import SuiviDashboard from "../pages/workspace/suivi/orchestrer/SuiviDashboard.jsx";
import RendezVous from "../pages/workspace/Rendez_vous/RendezVous.jsx";
import PermissionOrchestrer from "../pages/workspace/suivi/permisssions/permissionOrchestrer.jsx";

const medecinRoutes = [
  {
    path: "/medecin",
    element: (
      <ProtectedRoute allowedRoles={["medecin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="patients" replace /> }, // default /medecin
      { path: "patients", element: <PatientsPage /> },
      { path: "settings", element: <ProfilPage /> },
      

    ],
  },
  // Workspace pour un patient existant (numero) ou nouveau (new),
  {
  path: "/medecin/patient/:numero/workspace",//for existing patient workspace
  element: (
    <ProtectedRoute allowedRoles={["medecin"]}>
      <MainWorkspaceLayout />
    </ProtectedRoute>
  ),
  children: [
      { index: true, element: <Navigate to="profil" replace /> },

    {
      path: "profil",
      element: <Profilpage />,
    },
    {
      path: "social",
      element: <NewPatientGuard><Social /></NewPatientGuard>,
     
    },
    {
      path: "VIH",
      element: <NewPatientGuard><VIH /></NewPatientGuard>,
    },
     {
      path: "antecedents",
      element: <NewPatientGuard><Antecedent /></NewPatientGuard>,
      children: [
        { index: true, element: <Navigate to="medical" replace /> },
        { path: "medical", element: <MedicalOrchestrer /> },
        { path: "familial", element: <FamilyOrchestrer /> },
        { path: "gyneco", element: <GynecoOrchestrer /> },
        { path: "therapeutic", element: <TherapeuticOrchestrer /> },
        { path: "habitudes-vie", element: <HabitudesVieOrchestrer /> },
        { path: "surgical", element: <SurgicalOrchestrer /> },
        { path: "transfusion", element: <TransfusionOrchestrer /> },
        { path: "tpe-prep", element: <TpePrepOrchestrer /> },
      ]
    },
    
    {
      path: "examen-cliniques",
      element: <NewPatientGuard><ExamenLayout /></NewPatientGuard>,
      children: [
        { index: true, element: <Navigate to="signesCliniques" replace /> },
        { path: "signesCliniques", element: <SignesCliniques /> },
        { path: "signesFonctionnels", element: <SignesFonctionnels /> },
        { path: "observation", element: <ObservationPage /> },
        { path: "observance", element: <ObservancePage /> },
      ],
    },
    {
      path: "biologie",
      element: <NewPatientGuard><ResultatsBiologiques /></NewPatientGuard>,

    },
    {
      path: "biologie/genotypage",
      element: <NewPatientGuard><GenotypagePage /></NewPatientGuard>,
    },
    {
      path: "prescription-examens",
      element: <NewPatientGuard><PrescriptionExamens /></NewPatientGuard>,
    },
    {
      path: "prescription-medicale",
      element: <NewPatientGuard><PrescreptionMedical /></NewPatientGuard>,
    },
        {
      path: "rendez-vous",
      element: <NewPatientGuard><RendezVous /></NewPatientGuard>,
    },
    {
      path: "conclusion",
      element: <NewPatientGuard><Conclusion /></NewPatientGuard>,
    },
    {
      path: "suivi",
      element: <NewPatientGuard><SuiviLayout /></NewPatientGuard>,
      children: [
        { index: true, element: <Navigate to="Dashboard" replace /> },
        { path: "Dashboard", element: <SuiviDashboard /> },
        { path: "Permissions",    element: <PermissionOrchestrer /> },       
      ],
    },
  ],
}

];

export default medecinRoutes;
