import { useState } from "react";

export default function AntecedentsPage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Antécédents
          </h1>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-xl text-sm hover:bg-gray-100">
            Historique
          </button>

          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-black text-white rounded-xl text-sm hover:opacity-90"
            >
              Enregistrer
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-black text-white rounded-xl text-sm hover:opacity-90"
            >
              Modifier
            </button>
          )}
        </div>
      </div>

      {/* GRID SECTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* MEDICAL */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">
            Antécédents Médicaux
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Diabète
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Hypertension
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Cardiopathies
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Insuffisance rénale
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Asthme / BPCO
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Cancer
            </label>
          </div>

          <input
            type="text"
            placeholder="Autres..."
            disabled={!isEditing}
            className="mt-6 w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* INFECTIOUS */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">
            Antécédents Infectieux
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Tuberculose
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Hépatites virales
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Syphilis
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Gonococcie
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Chlamydia
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={!isEditing} />
              Zona récidivant
            </label>
          </div>
        </div>

        {/* THERAPEUTIC */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">
            Antécédents Thérapeutiques
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Médicaments chroniques"
              disabled={!isEditing}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              placeholder="Automédication"
              disabled={!isEditing}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              placeholder="Médecines traditionnelles"
              disabled={!isEditing}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              placeholder="Allergies médicamenteuses"
              disabled={!isEditing}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* CHIRURGICAL */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              Antécédents Chirurgicaux
            </h2>

            {isEditing && (
              <button className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100">
                + Ajouter
              </button>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border rounded-xl px-4 py-3">
              <span>Appendicectomie</span>
              <span className="text-gray-500">2018</span>
            </div>

            <div className="flex justify-between border rounded-xl px-4 py-3">
              <span>Pontage coronarien</span>
              <span className="text-gray-500">2022</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}