import { Link } from "react-router-dom";

export default function PatientsPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mes Patients</h2>
      <p>Liste des patients suivis par le médecin.</p>

      <div className="mt-6">
        <Link
          to="/medecin/workspace"
          className="bg-blue-600 text-dark px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Aller au Workspace
        </Link>
      </div>
    </div>
  );
}
