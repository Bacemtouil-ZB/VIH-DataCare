import { Navigate } from "react-router-dom";
import NewPatientGuard from "./NewPatientGuard.jsx";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import DashboardLayout from "../../../shared/components/layout/DashboardLayout";
import PatientsPage from "../pages/PatientsPage";
import DashboardMed from "../pages/DashboardMed";
import ProfilPage from "../../../pages/parametres/profile";
import MainWorkspaceLayout from "../pages/MainWorkspaceLayout";
import ExamenLayout from "../pages/workspace/Examen_cliniques/ExamenLayout";
import ObservationPage from "../pages/workspace/Examen_cliniques/ObservationPage";
import HabitudesPage from "../pages/workspace/Examen_cliniques/HabitudesPage";
import Profilpage from "../pages/workspace/Profil/ProfilPageWorkspace"
import Social from "../pages/workspace/Social/SocialFormPage.jsx";
import VIH from "../pages/workspace/VIH/VIH";
import AntecedentsLayout from "../pages/workspace/Antecedents/AntecedentLayout";
import SignesFonctionnels from "../pages/workspace/Examen_cliniques/SignesFonctionnels";
import SignesCliniques from "../pages/workspace/Examen_cliniques/SignesCliniques";
import ResultatsBiologiquesLayout from "../pages/workspace/resultats_biologiques/resultats_biologiquesLayout";
import Standard from "../pages/workspace/resultats_biologiques/Standard";
import Serologie from "../pages/workspace/resultats_biologiques/Serologie";
import Microbiologie from "../pages/workspace/resultats_biologiques/Microbiologie";
import PrescriptionExamens from "../pages/workspace/prescreption_dexamens/PrescriptionExamens";
import PrescreptionMedical from "../pages/workspace/prescreption_medical/PrescreptionMedical";
import Conclusion from "../pages/workspace/conclusion/Conclusion";
import SuiviLayout from "../pages/workspace/suivi/SuiviLayout";
import Dashbord from "../pages/workspace/suivi/Dashbord";
import ControleTherapeutique from "../pages/workspace/suivi/controleTherapitique";

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
      { path: "dashboard", element: <DashboardMed /> },
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
      element: <NewPatientGuard><AntecedentsLayout /></NewPatientGuard>,
    },
    
    {
      path: "examen-cliniques",
      element: <NewPatientGuard><ExamenLayout /></NewPatientGuard>,
      children: [
        { index: true, element: <Navigate to="signesCliniques" replace /> },
        { path: "signesCliniques", element: <SignesCliniques /> },
        { path: "signesFonctionnels", element: <SignesFonctionnels /> },
        { path: "observation", element: <ObservationPage /> },
        { path: "habitudes", element: <HabitudesPage /> },
      ],
    },
    {
      path: "biologie",
      element: <NewPatientGuard><ResultatsBiologiquesLayout /></NewPatientGuard>,
      children: [
        { index: true, element: <Navigate to="standard" replace /> },
        { path: "standard", element: <Standard /> },
        { path: "serologie", element: <Serologie /> },
        { path: "microbiologie", element: <Microbiologie /> },
      ],
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
      path: "conclusion",
      element: <NewPatientGuard><Conclusion /></NewPatientGuard>,
    },
    {
      path: "suivi",
      element: <NewPatientGuard><SuiviLayout /></NewPatientGuard>,
      children: [
        { index: true, element: <Navigate to="Dashbord" replace /> },
        { path: "Dashbord", element: <Dashbord /> },
        { path: "controleTherapeutique", element: <ControleTherapeutique /> },
        { path: "habitudes", element: <HabitudesPage /> },
      ],
    },
  ],
}

];

export default medecinRoutes;
