// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { Alert } from "../../../../../shared/utils/alertService.js";
// import {
//   createPatient,
//   updatePatient,
//   getPatientByNumero
// } from "../../../services/patientServices.jsx";

// import ProfilForm from "../../../components/forms/ProfileForme.jsx";

// export default function ProfilPageWorkspace() {
//   const { numero } = useParams();
//   const navigate = useNavigate();

//   const isNew = numero === "new";

//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(isNew);
//   const [initialData, setInitialData] = useState(null);

//   const [formData, setFormData] = useState({
//     numero: "",
//     name: "",
//     surname: "",
//     birthdate: "",
//     gender: "",
//     city_of_birth: "",
//     city_of_residence: "",
//     phone: "",
//     address: "",
//     hospitalisation: "externe",
//     created_by_name: "",
//     updated_by_name: "",
//     updated_at: ""
//   });

//   // ==============================
//   // Charger patient existant
//   // ==============================
//   useEffect(() => {
//     if (!isNew) {
//       const fetchPatient = async () => {
//         try {
//           setLoading(true);

//           const data = await getPatientByNumero(numero);
//           const patient = data.patient || data;

//           if (patient) {
//             const formattedPatient = {
//               ...patient,
//               birthdate: patient.birthdate
//                 ? patient.birthdate.split("T")[0]
//                 : ""
//             };

//             setFormData(formattedPatient);
//             setInitialData(formattedPatient);
//           } else {
//             toast.warning("Patient introuvable");
//           }

//         } catch (error) {
//           console.error("Erreur chargement patient:", error);
//           toast.error("Impossible de charger les données du patient");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchPatient();
//     }
//   }, [numero, isNew]);

//   // ==============================
//   // Protection fermeture page
//   // ==============================
//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (isEditing && !isNew) {
//         e.preventDefault();
//         e.returnValue = "";
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [isEditing, isNew]);

//   // ==============================
//   // Handle change
//   // ==============================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ==============================
//   // Handle submit
//   // ==============================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isNew) {
//   const result = await Alert.fire({
//     title: "Enregistrer les modifications ?",
//     html: `
//       <div class="text-start">
//         <p class="mb-2">Les changements suivants seront appliqués :</p>
//         <ul class="small text-muted">
//           <li>Mise à jour des informations personnelles</li>
//           <li>Modification du dossier patient</li>
//         </ul>
//       </div>
//     `,
//     icon: "question",
//     showCancelButton: true,
//     confirmButtonText: "Confirmer",
//     cancelButtonText: "Annuler",
//   });

//   if (!result.isConfirmed) {
//     toast.info("Modification annulée");
//     return;
//   }
// }

//     try {
//       setLoading(true);

//       if (isNew) {
//         const response = await createPatient(formData);
//         const newNumero = response.patient?.numero || response.numero;

//         toast.success("Patient créé avec succès");

//         navigate(`/medecin/patient/${newNumero}/workspace/profil`);
//       } else {
//         await updatePatient(formData.id, formData);

//         toast.success("Patient mis à jour avec succès");
//         setIsEditing(false);
//       }

//     } catch (error) {
//       console.error("Erreur:", error);

//       toast.error(
//         error.response?.data?.message ||
//         "Erreur lors de l'enregistrement du patient"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==============================
//   // Handle cancel
//   // ==============================
//   const handleCancel = () => {
//     if (initialData) {
//       setFormData(initialData);
//     }
//     setIsEditing(false);
//     toast.info("Modifications annulées");
//   };

//   // ==============================
//   // Loading state
//   // ==============================
//   if (loading) return <p>Chargement...</p>;

//   return (
//     <div className="medical-page">
//       <div className="page-header">
//         <h2>{isNew ? "Nouveau patient" : "Profil du patient"}</h2>
//       </div>

//       <ProfilForm
//         formData={formData}
//         onChange={handleChange}
//         onSubmit={handleSubmit}
//         isNew={isNew}
//         isEditing={isEditing}
//         setIsEditing={setIsEditing}
//         onCancel={handleCancel}
//       />
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Alert } from "../../../../../shared/utils/alertService.js";
import {
  createPatient,
  updatePatient,
  getPatientByNumero
} from "../../../services/patientServices.jsx";
import { getAllDoctors } from "../../../services/patientServices.jsx"; // Pour dropdown médecins
import ProfilForm from "../../../components/forms/ProfileForme.jsx";

export default function ProfilPageWorkspace() {
  const { numero } = useParams();
  const navigate = useNavigate();

  const isNew = numero === "new";

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(isNew);
  const [initialData, setInitialData] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    numero_dossier: "",
    name: "",
    surname: "",
    birthdate: "",
    gender: "",
    birth_address_id: "",
    birth_address_code_postal: "",
    residence_address_id: "",
    residence_address_code_postal: "",
    exact_address: "",
    phone: "",
    hospitalisation: "externe",
    doctor_id: "",
    remarques: "",
    created_by_name: "",
    updated_by_name: "",
    updated_at: ""
  });

  // ==============================
  // Charger patient existant
  // ==============================
  useEffect(() => {
    const fetchDoctors = async () => {
      const docs = await getAllDoctors(); // role = medecin
      setDoctors(docs);
    };
    fetchDoctors();

    if (!isNew) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          const data = await getPatientByNumero(numero);
          if (data) {
            // Formater les dates
            const formattedPatient = {
              ...data,
              birthdate: data.birthdate ? data.birthdate.split("T")[0] : ""
            };
            setFormData(formattedPatient);
            setInitialData(formattedPatient);
          } else {
            toast.warning("Patient introuvable");
          }
        } catch (error) {
          console.error("Erreur chargement patient:", error);
          toast.error("Impossible de charger les données du patient");
        } finally {
          setLoading(false);
        }
      };
      fetchPatient();
    }
  }, [numero, isNew]);

  // ==============================
  // Protection fermeture page
  // ==============================
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEditing && !isNew) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing, isNew]);

  // ==============================
  // Handle change
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ==============================
  // Handle submit
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNew) {
      const result = await Alert.fire({
        title: "Enregistrer les modifications ?",
        html: `
          <div class="text-start">
            <p class="mb-2">Les changements suivants seront appliqués :</p>
            <ul class="small text-muted">
              <li>Mise à jour des informations personnelles</li>
              <li>Modification du dossier patient</li>
            </ul>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmer",
        cancelButtonText: "Annuler",
      });

      if (!result.isConfirmed) {
        toast.info("Modification annulée");
        return;
      }
    }

    try {
      setLoading(true);
      if (isNew) {
        const response = await createPatient(formData, formData.created_by_name);
        const newNumero = response.numero_dossier;
        toast.success("Patient créé avec succès");
        navigate(`/medecin/patient/${newNumero}/workspace/profil`);
      } else {
        await updatePatient(formData.id, formData, formData.updated_by_name);
        toast.success("Patient mis à jour avec succès");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement du patient");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Handle cancel
  // ==============================
  const handleCancel = () => {
    if (initialData) setFormData(initialData);
    setIsEditing(false);
    toast.info("Modifications annulées");
  };

  // ==============================
  // Loading state
  // ==============================
  if (loading) return <p>Chargement...</p>;

  return (
    <div className="medical-page">
      <div className="page-header">
        <h2>{isNew ? "Nouveau patient" : "Profil du patient"}</h2>
      </div>

      <ProfilForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isNew={isNew}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onCancel={handleCancel}
        doctors={doctors}
      />
    </div>
  );
}

