import React, { useEffect, useMemo, useState } from "react";
import { getPatientAuditLogs, getAuditLogDetails } from "../services/auditService";
import { toast } from "react-toastify";

import "./audit_logs_page.css";

const DEFAULT_LIMIT = 50;

const formatDateTime = (value) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value || "—";
  }
};

const safeText = (value) =>
  value === null || value === undefined || value === "" ? "—" : value;

const AuditLogsPage = () => {
  // patient exact search
  const [patientNumeroInput, setPatientNumeroInput] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // filters
  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
  const [anomaly, setAnomaly] = useState(""); // "", "true", "false"
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // pagination
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);

  // data
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);

  // details modal
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState(null);

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit],
  );

  const fetchPatient = async (numero) => {
    setLoading(true);
    try {
      const data = await getPatientAuditLogs(numero, {
        module: module || undefined,
        action: action || undefined,
        anomaly: anomaly || undefined,
        from: from || undefined,
        to: to || undefined,
        limit,
        offset,
      });

      setSelectedPatient(data.patient || null);
      setLogs(data.logs || []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setSelectedPatient(null);
      setLogs([]);
      setTotal(0);
      toast.error(err?.message || "Erreur chargement audit patient");
    } finally {
      setLoading(false);
    }
  };

  // refetch when filters/pagination change (only if a patient is already selected)
  useEffect(() => {
    if (selectedPatient?.numero) {
      fetchPatient(selectedPatient.numero);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, action, anomaly, from, to, limit, offset]);

  const onSearchPatient = async (e) => {
    e.preventDefault();
    const numero = patientNumeroInput.trim();
    if (!numero) {
      toast.info("Veuillez entrer le numéro du patient");
      return;
    }
    setOffset(0);
    await fetchPatient(numero);
  };

  const openDetails = async (logId) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    setSelectedLogDetails(null);
    try {
      const data = await getAuditLogDetails(logId);
      setSelectedLogDetails(data.log || null);
    } catch (err) {
      toast.error(err?.message || "Erreur chargement détails audit");
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const copyJson = async (obj, label) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(obj ?? {}, null, 2));
      toast.success(`${label} copié`);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const nextPage = () => {
    if (page < totalPages) setOffset(offset + limit);
  };

  const prevPage = () => {
    if (page > 1) setOffset(Math.max(0, offset - limit));
  };

  return (
    <div className="auditPage">
      <div className="auditContainer">
        <div className="auditHeader">
          <div className="auditHeaderLeft">
            <div className="auditTitleIcon" aria-hidden="true">
              <i className="bi bi-activity" />
            </div>
            <div>
              <h2 className="auditTitle">Audit patient</h2>
              <p className="auditSubtitle">
                Rechercher un patient par numéro et consulter la traçabilité.
              </p>
            </div>
          </div>
        </div>

        <div className="auditCard">
          <form className="auditSearchRow" onSubmit={onSearchPatient}>
            <div className="auditField auditFieldWide">
              <label className="auditLabel">Numéro patient (exact)</label>
              <input
                className="auditInput"
                value={patientNumeroInput}
                onChange={(e) => setPatientNumeroInput(e.target.value)}
                placeholder="Ex: VIH-2026-001"
              />
            </div>

            <button className="auditBtn auditBtnPrimary" type="submit">
              <i className="bi bi-search" aria-hidden="true" />
              Rechercher
            </button>

            <button
              className="auditBtn auditBtnGhost"
              type="button"
              onClick={() => {
                setPatientNumeroInput("");
                setSelectedPatient(null);
                setLogs([]);
                setTotal(0);
                setOffset(0);
                setModule("");
                setAction("");
                setAnomaly("");
                setFrom("");
                setTo("");
              }}
              title="Réinitialiser"
            >
              <i className="bi bi-x-lg" aria-hidden="true" />
              Reset
            </button>
          </form>

          {selectedPatient && (
            <div className="auditPatientBanner">
              <div>
                <div className="auditPatientName">
                  <i className="bi bi-person-badge" aria-hidden="true" />{" "}
                  Patient: {selectedPatient.numero} — {selectedPatient.name}{" "}
                  {selectedPatient.surname}
                </div>
                <div className="auditPatientMeta">{total} log(s)</div>
              </div>
              <button
                type="button"
                className="auditBtn auditBtnGhost"
                onClick={() => fetchPatient(selectedPatient.numero)}
                disabled={loading}
                title="Rafraîchir"
              >
                <i className="bi bi-arrow-clockwise" aria-hidden="true" />
                Rafraîchir
              </button>
            </div>
          )}

          <div className="auditFiltersHeader">
            <i className="bi bi-funnel" aria-hidden="true" />
            <div>Filtres</div>
          </div>

          <div className="auditFiltersGrid">
            <div className="auditField">
              <label className="auditLabel">Module</label>
              <input
                className="auditInput"
                value={module}
                onChange={(e) => {
                  setOffset(0);
                  setModule(e.target.value);
                }}
                placeholder="Ex: VIH"
              />
            </div>

            <div className="auditField">
              <label className="auditLabel">Action</label>
              <input
                className="auditInput"
                value={action}
                onChange={(e) => {
                  setOffset(0);
                  setAction(e.target.value);
                }}
                placeholder="Ex: VIH_UPDATE"
              />
            </div>

            <div className="auditField">
              <label className="auditLabel">Anomalie</label>
              <select
                className="auditSelect"
                value={anomaly}
                onChange={(e) => {
                  setOffset(0);
                  setAnomaly(e.target.value);
                }}
              >
                <option value="">Tous</option>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </div>

            <div className="auditField">
              <label className="auditLabel">Du</label>
              <input
                className="auditInput"
                type="date"
                value={from}
                onChange={(e) => {
                  setOffset(0);
                  setFrom(e.target.value);
                }}
              />
            </div>

            <div className="auditField">
              <label className="auditLabel">Au</label>
              <input
                className="auditInput"
                type="date"
                value={to}
                onChange={(e) => {
                  setOffset(0);
                  setTo(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div className="auditSpacer" />

        <div className="auditCard auditCardNoPad">
          <div className="auditTableWrap">
            <table className="auditTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Patient</th>
                  <th>Module</th>
                  <th>Action</th>
                  <th>IP</th>
                  <th>Anomalie</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="auditTd">
                      Chargement...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="auditTd auditMuted">
                      Aucun log. Recherchez un patient.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id}>
                      <td className="auditTd">{formatDateTime(l.created_at)}</td>
                      <td className="auditTd">
                        <div className="auditUserName">
                          {safeText(l.user_nom)} {safeText(l.user_prenom)}
                        </div>
                        <div className="auditMuted">{safeText(l.user_email)}</div>
                      </td>
                      <td className="auditTd">{safeText(l.user_role)}</td>
                      <td className="auditTd">{safeText(l.patient_numero)}</td>
                      <td className="auditTd">{safeText(l.module)}</td>
                      <td className="auditTd">{safeText(l.action)}</td>
                      <td className="auditTd">{safeText(l.ip_address)}</td>
                      <td className="auditTd">
                        <span
                          className={`auditBadge ${l.is_anomaly ? "isYes" : "isNo"}`}
                        >
                          {l.is_anomaly ? "Oui" : "Non"}
                        </span>
                      </td>
                      <td className="auditTd">
                        <button
                          type="button"
                          className="auditBtn auditBtnGhost auditBtnSmall"
                          onClick={() => openDetails(l.id)}
                        >
                          <i className="bi bi-eye" aria-hidden="true" />
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="auditFooter">
            <div>
              Total: <strong>{total}</strong> — Page {page}/{totalPages}
            </div>
            <div className="auditFooterRight">
              <button
                className="auditBtn auditBtnGhost"
                type="button"
                onClick={prevPage}
                disabled={page <= 1}
              >
                <i className="bi bi-chevron-left" aria-hidden="true" />
                Précédent
              </button>
              <button
                className="auditBtn auditBtnGhost"
                type="button"
                onClick={nextPage}
                disabled={page >= totalPages}
              >
                Suivant
                <i className="bi bi-chevron-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Details Modal */}
        {detailsOpen && (
          <div
            className="auditModalOverlay"
            onClick={() => setDetailsOpen(false)}
          >
            <div className="auditModal" onClick={(e) => e.stopPropagation()}>
              <div className="auditModalHeader">
                <h3 className="auditModalTitle">Détails du log</h3>
                <button
                  className="auditBtn auditBtnGhost"
                  type="button"
                  onClick={() => setDetailsOpen(false)}
                >
                  <i className="bi bi-x-lg" aria-hidden="true" />
                  Fermer
                </button>
              </div>

              <div className="auditModalBody">
                {detailsLoading ? (
                  <div>Chargement...</div>
                ) : !selectedLogDetails ? (
                  <div>Aucun détail.</div>
                ) : (
                  <>
                    <div className="auditMetaGrid">
                      <div className="auditMetaBox">
                        <div className="auditMetaKey">Date</div>
                        <div className="auditMetaVal">
                          {formatDateTime(selectedLogDetails.created_at)}
                        </div>
                      </div>

                      <div className="auditMetaBox">
                        <div className="auditMetaKey">Utilisateur</div>
                        <div className="auditMetaVal">
                          {safeText(selectedLogDetails.user_nom)}{" "}
                          {safeText(selectedLogDetails.user_prenom)}
                        </div>
                        <div className="auditMuted">
                          {safeText(selectedLogDetails.user_email)}
                        </div>
                      </div>

                      <div className="auditMetaBox">
                        <div className="auditMetaKey">Réseau</div>
                        <div className="auditMetaVal">
                          <i className="bi bi-hdd-network" aria-hidden="true" />{" "}
                          IP: {safeText(selectedLogDetails.ip_address)}
                        </div>
                        <div className="auditMuted">
                          UA: {safeText(selectedLogDetails.user_agent)}
                        </div>
                        <div className="auditMuted">
                          Request: {safeText(selectedLogDetails.request_id)}
                        </div>
                      </div>
                    </div>

                    <div className="auditJsonActions">
                      <button
                        type="button"
                        className="auditBtn auditBtnGhost"
                        onClick={() =>
                          copyJson(selectedLogDetails.old_data, "old_data")
                        }
                      >
                        <i className="bi bi-clipboard" aria-hidden="true" />
                        Copier old_data
                      </button>

                      <button
                        type="button"
                        className="auditBtn auditBtnGhost"
                        onClick={() =>
                          copyJson(selectedLogDetails.new_data, "new_data")
                        }
                      >
                        <i className="bi bi-clipboard" aria-hidden="true" />
                        Copier new_data
                      </button>
                    </div>

                    <div className="auditJsonGrid">
                      <div>
                        <div className="auditJsonTitle">
                          Anciennes données (old_data)
                        </div>
                        <pre className="auditPre">
                          {JSON.stringify(selectedLogDetails.old_data, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <div className="auditJsonTitle">
                          Nouvelles données (new_data)
                        </div>
                        <pre className="auditPre">
                          {JSON.stringify(selectedLogDetails.new_data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;