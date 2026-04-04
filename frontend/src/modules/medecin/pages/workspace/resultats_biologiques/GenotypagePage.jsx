import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ActionButton, PageTitle, Spinner } from "../../../../../shared/components";
import { getResultatsByNumeroDossier } from "../../../services/resultatBiologiqueService";
import { isPdf } from "./resultatsBiologiquesHelpers";

export default function GenotypagePage() {
  const { numero } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ── État chargement initial ────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // ── Fichiers existants (data-URL ou http) chargés depuis la DB ───────────
  const [existingFiles, setExistingFiles] = useState([]); // string[]

  // ── Chargement initial ────────────────────────────────────────────────────
  useEffect(() => {
    const scanFromState = location.state?.scanUrl || "";
    if (scanFromState) {
      setExistingFiles(Array.isArray(scanFromState) ? scanFromState : [scanFromState]);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getResultatsByNumeroDossier(numero);
        const items = response?.resultats || [];
        const withScan = items.find((row) => row.genotypage_file_url);

        if (withScan) {
          try {
            const parsed = JSON.parse(withScan.genotypage_file_url);
            setExistingFiles(Array.isArray(parsed) ? parsed : [parsed]);
          } catch {
            setExistingFiles(withScan.genotypage_file_url ? [withScan.genotypage_file_url] : []);
          }
        }
      } catch (err) {
        setError(err?.message || "Erreur lors du chargement du génotypage");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [numero, location.state?.scanUrl]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="ec-page-bg rb-page">
        <PageTitle title="Test de génotypage" />
        <Spinner />
      </div>
    );
  }

  return (
    <div className="ec-page-bg rb-page">
      <PageTitle title="Test de génotypage" />

      {error && (
        <div className="rb-alert-no-bilan">
          <i className="bi bi-exclamation-circle me-2" />
          {error}
        </div>
      )}

      {/* ── Aperçu des fichiers enregistrés ──────────────────────────────── */}
      {existingFiles.length > 0 && (
        <div className="rb-section">
          <div className="rb-section-header">
            <div className="rb-section-title">
              <i className="bi bi-eye me-2" />
              Aperçu des fichiers enregistrés
            </div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            {existingFiles.map((url, idx) =>
              isPdf(url) ? (
                <iframe
                  key={idx}
                  title={`Génotypage PDF ${idx + 1}`}
                  src={url}
                  style={{ width: "100%", minHeight: "60vh", border: "none", borderRadius: 8 }}
                />
              ) : (
                <img
                  key={idx}
                  src={url}
                  alt={`Scan génotypage ${idx + 1}`}
                  style={{ maxWidth: "100%", borderRadius: 8, border: "1px solid #e5e7eb" }}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="rb-form-actions" style={{ marginTop: 16, gap: 8, display: "flex", justifyContent: "flex-end" }}>
        <ActionButton
          action="annuler"
          label="Retour biologie"
          size="sm"
          onClick={() => {
            const restoredFiles = location.state?.scanUrl || existingFiles;
            navigate(`/medecin/patient/${numero}/workspace/biologie`, {
              state: {
                scrollToGenotypage: true,
                restoredGenotypage: Array.isArray(restoredFiles) ? restoredFiles : [restoredFiles],
              },
              replace: true,
            });
          }}
        />
      </div>
    </div>
  );
}