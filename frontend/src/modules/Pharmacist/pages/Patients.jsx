import React from 'react'
import { Link } from "react-router-dom";
const Patients = () => {
  return (
     <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Mes Patients</h2>
        <Link
          to="/pharmacien/workspace"
          className="bg-blue-600 text-dark px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Aller au Workspace
        </Link>
      </div>
    
  )
}

export default Patients
