import React, { useEffect, useMemo, useState } from "react";
import { getPatientAuditLogs, getAuditLogDetails } from "../services/auditService";
import { toast } from "react-toastify";
import "./audit_logs_page.css";

/**
 * 1) Put here your real actions list (the same ones you use in action_enum).
 *    You can add/remove anytime without touching the rest of the page.
 */
const ACTIONS = [
  // Examples (replace with your real values):
  "PATIENT_VIEW",
  "PATIENT_CREATE",
  "PATIENT_UPDATE",
  "PATIENT_DELETE",
  "VIH_VIEW",
  "VIH_CREATE",
  "VIH_UPDATE",
  "VIH_DELETE",
];

const DEFAULT_LIMIT = 50;

const fmt = (v) => {
  try {
    return new Date(v).toLocaleString();
  } catch {
    return v || "—";
  }
};
const txt = (v) => (v === null || v === undefined || v === "" ? "—" : v);

const AuditLogsPage = () => {
  const [patientNumeroInput, setPatientNumeroInput] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // filters
  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
  const [anomaly, setAnomaly] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [limit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState(null);

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit],
  );

  // Derive module list from ACTIONS (prefix before first "_")
  const MODULES = useMemo(() => {
    const set = new Set();
    ACTIONS.forEach((a) => {
      const m = String(a).split("_")[0];
      if (m) set.add(m);
    });
    return Array.from(set).sort();
  }, []);

  const actionsForSelectedModule = useMemo(() => {
    if (!module) return ACTIONS;
    return ACTIONS.filter((a) => String(a).startsWith(`${module}_`));
  }, [module]);

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

  useEffect(() => {
    if (selectedPatient?.numero) fetchPatient(selectedPatient.numero);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, action, anomaly, from, to, offset]);

  const onSearch = async (e) => {
    e.preventDefault();
    const numero = patientNumeroInput.trim();
    if (!numero) return toast.info("Veuillez entrer le numéro du patient");
    setOffset(0);
    await fetchPatient(numero);
  };

  const openDetails = async (id) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    setDetails(null);
    try {
      const data = await getAuditLogDetails(id);
      setDetails(data.log || null);
    } catch (err) {
      toast.error(err?.message || "Erreur chargement détails");
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setDetails(null);
  };

  const next = () => page < totalPages && setOffset(offset + limit);
  const prev = () => page > 1 && setOffset(Math.max(0, offset - limit));

  return (
    <div className="audit">
      <header className="audit__header">
        <div>
          <h2 className="audit__title">Audit patient</h2>
          <p className="audit__subtitle">
            Recherche par numéro patient — table scrollable — pagination toujours
            visible.
          </p>
        </div>
      </header>

      <div className="auditContainer">
        <section className="audit__card">
          <form className="audit__row" onSubmit={onSearch}>
            <div className="audit__field audit__field--grow">
              <label className="audit__label">Numéro patient</label>
              <input
                className="audit__input"
                value={patientNumeroInput}
                onChange={(e) => setPatientNumeroInput(e.target.value)}
                placeholder="Ex: VIH-2026-001"
              />
            </div>

            <button className="audit__btn audit__btn--primary" type="submit">
              <i className="bi bi-search" /> Rechercher
            </button>

            <button
              className="audit__btn"
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
              <i className="bi bi-arrow-counterclockwise" /> Reset
            </button>
          </form>

          {selectedPatient && (
            <div className="audit__patient">
              <div>
                <div className="audit__patientTitle">
                  <i className="bi bi-person-badge" /> {selectedPatient.numero} —{" "}
                  {selectedPatient.name} {selectedPatient.surname}
                </div>
                <div className="audit__muted">
                  {total} log(s) • Page {page}/{totalPages}
                </div>
              </div>

              <button
                className="audit__btn"
                type="button"
                onClick={() => fetchPatient(selectedPatient.numero)}
                disabled={loading}
                title="Rafraîchir"
              >
                <i className="bi bi-arrow-clockwise" /> Rafraîchir
              </button>
            </div>
          )}

          <div className="audit__filters">
            {/* MODULE as select */}
            <div className="audit__field">
              <label className="audit__label">Module</label>
              <select
                className="audit__input"
                value={module}
                onChange={(e) => {
                  setOffset(0);
                  const nextModule = e.target.value;
                  setModule(nextModule);

                  // if current action doesn't belong to module, reset action
                  if (nextModule && action && !action.startsWith(`${nextModule}_`)) {
                    setAction("");
                  }
                }}
              >
                <option value="">Tous</option>
                {MODULES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* ACTION as select (filtered by module) */}
            <div className="audit__field">
              <label className="audit__label">Action</label>
              <select
                className="audit__input"
                value={action}
                onChange={(e) => {
                  setOffset(0);
                  setAction(e.target.value);
                }}
              >
                <option value="">Toutes</option>
                {actionsForSelectedModule.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="audit__field">
              <label className="audit__label">Anomalie</label>
              <select
                className="audit__input"
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

            <div className="audit__field">
              <label className="audit__label">Du</label>
              <input
                className="audit__input"
                type="date"
                value={from}
                onChange={(e) => {
                  setOffset(0);
                  setFrom(e.target.value);
                }}
              />
            </div>

            <div className="audit__field">
              <label className="audit__label">Au</label>
              <input
                className="audit__input"
                type="date"
                value={to}
                onChange={(e) => {
                  setOffset(0);
                  setTo(e.target.value);
                }}
              />
            </div>
          </div>
        </section>

        <div className="auditSpacer" />

        <section className="audit__card audit__card--table">
          {/* IMPORTANT: the scroll happens INSIDE this block, not on the page */}
          <div className="auditTable">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 160 }}>Date</th>
                  <th style={{ width: 240 }}>Utilisateur</th>
                  <th style={{ width: 110 }}>Rôle</th>
                  <th style={{ width: 130 }}>Patient</th>
                  <th style={{ width: 110 }}>Module</th>
                  <th style={{ width: 160 }}>Action</th>
                  <th style={{ width: 140 }}>IP</th>
                  <th style={{ width: 100 }}>Anomalie</th>
                  <th style={{ width: 120 }} />
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="audit__cell audit__muted">
                      Chargement…
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="audit__cell audit__muted">
                      Aucun log. Recherchez un patient.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id}>
                      <td className="audit__cell">{fmt(l.created_at)}</td>
                      <td className="audit__cell">
                        <div className="audit__strong">
                          {txt(l.user_nom)} {txt(l.user_prenom)}
                        </div>
                        <div className="audit__muted">{txt(l.user_email)}</div>
                      </td>
                      <td className="audit__cell">{txt(l.user_role)}</td>
                      <td className="audit__cell">{txt(l.patient_numero)}</td>
                      <td className="audit__cell">{txt(l.module)}</td>
                      <td className="audit__cell">{txt(l.action)}</td>
                      <td className="audit__cell">{txt(l.ip_address)}</td>
                      <td className="audit__cell">
                        <span
                          className={`auditTag ${l.is_anomaly ? "auditTag--danger" : "auditTag--ok"}`}
                        >
                          {l.is_anomaly ? "Oui" : "Non"}
                        </span>
                      </td>
                      <td className="audit__cell audit__cell--right">
                        <button
                          className="audit__btn audit__btn--sm"
                          type="button"
                          onClick={() => openDetails(l.id)}
                        >
                          <i className="bi bi-eye" /> Détails
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination always visible because it's outside the scroll area */}
          <div className="auditPager">
            <div className="audit__muted">
              Total: <span className="audit__strong">{total}</span> • Page {page}/{totalPages}
            </div>
            <div className="auditPager__actions">
              <button className="audit__btn audit__btn--sm" type="button" onClick={prev} disabled={page <= 1}>
                <i className="bi bi-chevron-left" /> Précédent
              </button>
              <button className="audit__btn audit__btn--sm" type="button" onClick={next} disabled={page >= totalPages}>
                Suivant <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        </section>

        {detailsOpen && (
          <div className="auditModal__overlay" onClick={closeDetails}>
            <div className="auditModal" onClick={(e) => e.stopPropagation()}>
              <div className="auditModal__header">
                <div className="auditModal__title">
                  <i className="bi bi-info-circle" /> Détails du log
                </div>

                <button
                  className="auditModal__close"
                  type="button"
                  onClick={closeDetails}
                  aria-label="Fermer"
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>

              <div className="auditModal__body">
                {detailsLoading ? (
                  <div className="audit__muted">Chargement…</div>
                ) : !details ? (
                  <div className="audit__muted">Aucun détail.</div>
                ) : (
                  <>
                    <div className="auditModal__meta">
                      <div><span className="auditModal__k">Date</span><span className="auditModal__v">{fmt(details.created_at)}</span></div>
                      <div><span className="auditModal__k">Utilisateur</span><span className="auditModal__v">{txt(details.user_nom)} {txt(details.user_prenom)} ({txt(details.user_email)})</span></div>
                      <div><span className="auditModal__k">Module</span><span className="auditModal__v">{txt(details.module)} • {txt(details.action)}</span></div>
                      <div><span className="auditModal__k">Patient</span><span className="auditModal__v">{txt(details.patient_numero)}</span></div>
                      <div><span className="auditModal__k">IP</span><span className="auditModal__v">{txt(details.ip_address)}</span></div>
                      <div><span className="auditModal__k">UA</span><span className="auditModal__v">{txt(details.user_agent)}</span></div>
                      <div><span className="auditModal__k">Request</span><span className="auditModal__v">{txt(details.request_id)}</span></div>
                    </div>

                    <div className="auditModal__jsonGrid">
                      <div>
                        <div className="auditModal__section">old_data</div>
                        <pre className="auditModal__pre">{JSON.stringify(details.old_data, null, 2)}</pre>
                      </div>
                      <div>
                        <div className="auditModal__section">new_data</div>
                        <pre className="auditModal__pre">{JSON.stringify(details.new_data, null, 2)}</pre>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="auditModal__footer">
                <button className="audit__btn" type="button" onClick={closeDetails}>
                  <i className="bi bi-x-lg" /> Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;