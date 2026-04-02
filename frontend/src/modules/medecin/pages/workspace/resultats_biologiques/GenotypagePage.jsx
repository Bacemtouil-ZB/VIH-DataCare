import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ActionButton, PageTitle, Spinner } from "../../../../../shared/components";
import { getResultatsByNumeroDossier } from "../../../services/resultatBiologiqueService";

export default function GenotypagePage() {
  const { numero } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const scanFromState = location.state?.scanUrl || "";

  const [loading, setLoading] = useState(!scanFromState);
  const [scanUrl, setScanUrl] = useState(scanFromState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (scanFromState) {
      setScanUrl(scanFromState);
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

        setScanUrl(withScan?.genotypage_file_url || "");
      } catch (err) {
        setError(err?.message || "Erreur lors du chargement du genotypage");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [numero, scanFromState]);

  const isPdf = useMemo(() => scanUrl.startsWith("data:application/pdf"), [scanUrl]);

  if (loading) {
    return (
      <div className="ec-page-bg rb-page">
        <PageTitle title="Genotypage" />
        <Spinner />
      </div>
    );
  }

  return (
    <div className="ec-page-bg rb-page">
      <PageTitle title="Genotypage" />

      {error && (
        <div className="rb-alert-no-bilan">
          <i className="bi bi-exclamation-circle me-2" />
          {error}
        </div>
      )}

      {!error && !scanUrl && (
        <div className="rb-alert-no-bilan">
          <i className="bi bi-info-circle me-2" />
          Aucun fichier genotypage trouve pour ce patient.
        </div>
      )}

      {scanUrl && (
        <div className="rb-section">
          <div className="rb-section-header">
            <div className="rb-section-title">
              <i className="bi bi-image me-2" />
              Fichier scanne
            </div>
          </div>

          <div style={{ padding: "16px" }}>
            {isPdf ? (
              <iframe
                title="Genotypage PDF"
                src={scanUrl}
                style={{ width: "100%", minHeight: "70vh", border: "none" }}
              />
            ) : (
              <img
                src={scanUrl}
                alt="Scan genotypage"
                style={{ maxWidth: "100%", borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
            )}
          </div>
        </div>
      )}

      <div className="rb-form-actions" style={{ marginTop: "16px" }}>
        <ActionButton
          action="annuler"
          label="Retour biologie"
          size="sm"
          onClick={() => navigate(`/medecin/patient/${numero}/workspace/biologie`)}
        />
      </div>
    </div>
  );
}
