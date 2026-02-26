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
  getPatientByNumero,
  getAllDoctors,
  getFormData
} from "../../../services/patientServices.jsx";
import ProfilForm from "../../../components/forms/ProfileForme.jsx";

export default function ProfilPageWorkspace() {
  const { numero } = useParams();
  const navigate = useNavigate();

  const isNew = numero === "new";

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(isNew);
  const [initialData, setInitialData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [formDataOptions, setFormDataOptions] = useState({
    governorates: [],
    postalCodes: []
  });

  const [formData, setFormData] = useState({
    numero: "",
    name: "",
    surname: "",
    birthdate: "",
    gender: "",
    birth_governorate: "",
    birth_postal_code_id: "",
    residence_governorate: "",
    residence_postal_code_id: "",
    residence_exact_address: "",
    phone: "",
    hospitalisation: "externe",
    doctor_id: "",
    remarques: "",
    id: null
  });

  /* ==============================
      Chargement initial
  ============================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Charger médecins
        const docs = await getAllDoctors();
        setDoctors(docs || []);

        // Charger gouvernorats et codes postaux
        const { governorates, postalCodes } = await getFormData();
        setFormDataOptions({ governorates, postalCodes });

        // Charger patient existant
        if (!isNew) {
          const data = await getPatientByNumero(numero);
          if (!data) {
            toast.warning("Patient introuvable");
            navigate("/medecin/patients");
            return;
          }

          setFormData({
            numero: data.numero_dossier || "",
            name: data.name || "",
            surname: data.surname || "",
            birthdate: data.birthdate ? data.birthdate.split("T")[0] : "",
            gender: data.gender || "",
            birth_governorate: data.birth_governorate || "",
            birth_postal_code_id: data.birth_postal_code_id || "",
            residence_governorate: data.residence_governorate || "",
            residence_postal_code_id: data.residence_postal_code_id || "",
            residence_exact_address: data.residence_exact_address || "",
            phone: data.phone || "",
            hospitalisation: data.hospitalisation || "externe",
            doctor_id: data.doctor_id || "",
            remarques: data.remarques || "",
            id: data.id
          });
          setInitialData(data);
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [numero, isNew, navigate]);

  /* ==============================
      Protection fermeture page
  ============================== */
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

  /* ==============================
      Submit sécurisé
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNew) {
      const result = await Alert.fire({
        title: "Enregistrer les modifications ?",
        html: `<p class="mb-2">Les changements seront appliqués au dossier patient.</p>`,
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
        const response = await createPatient(formData);
        toast.success("Patient créé avec succès");
        navigate(`/medecin/patient/${response.numero_dossier}/workspace/profil`);
      } else {
        await updatePatient(formData.id, formData);
        toast.success("Patient mis à jour avec succès");
        setIsEditing(false);
        setInitialData(formData);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
      Annuler modification
  ============================== */
  const handleCancel = () => {
    if (initialData) setFormData(initialData);
    setIsEditing(false);
    toast.info("Modifications annulées");
  };

  /* ==============================
      Loading UI
  ============================== */
  if (loading) return <p>Chargement...</p>;

  return (
    <div className="medical-page">
      <div className="page-header">
        <h2>{isNew ? "Nouveau patient" : "Profil du patient"}</h2>
      </div>

      <ProfilForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isNew={isNew}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onCancel={handleCancel}
        doctors={doctors}
        formDataOptions={formDataOptions} // <-- pass options ici
      />
    </div>
  );
}



