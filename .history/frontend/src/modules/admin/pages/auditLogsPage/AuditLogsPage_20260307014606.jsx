import React, { useEffect, useMemo, useState } from "react";
import { getPatientAuditLogs, getAuditLogDetails } from "../../services/auditService";
import { toast } from "react-toastify";
import "./auditLogsPage.css";

/**
 * Action enum values (from your DB)
 */
const ACTIONS = [
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",

  "PATIENT_CREATE",
  "PATIENT_UPDATE",
  "PATIENT_VIEW",

  "SOCIAL_CREATE",
  "SOCIAL_UPDATE",
  "SOCIAL_VIEW",

  "VIH_CREATE",
  "VIH_UPDATE",
  "VIH_VIEW",

  "EXAMEN_CLINIQUE_CREATE",
  "EXAMEN_CLINIQUE_UPDATE",
  "EXAMEN_CLINIQUE_VIEW",

  "OBSERVATION_CREATE",
  "OBSERVATION_UPDATE",
  "OBSERVATION_VIEW",

  "HABITUDE_DE_VIE_CREATE",
  "HABITUDE_DE_VIE_UPDATE",
  "HABITUDE_DE_VIE_VIEW",

  "SIGNE_CLINIQUE_VIEW",
  "SIGNE_CLINIQUE_UPDATE",
  "SIGNE_CLINIQUE_CREATE",

  "SIGNE_FONCTIONNEL_VIEW",
  "SIGNE_FONCTIONNEL_UPDATE",
  "SIGNE_FONCTIONNEL_CREATE",
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

const isPlainObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

const prettyValue = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Oui" : "Non";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

const buildDiffRows = (oldData, newData) => {
  const oldObj = isPlainObject(oldData) ? oldData : {};
  const newObj = isPlainObject(newData) ? newData : {};

  const keys = Array.from(
    new Set([...Object.keys(oldObj), ...Object.keys(newObj)]),
  ).sort();

  return keys.map((k) => ({
    key: k,
    oldValue: oldObj[k],
    newValue: newObj[k],
    changed:
      JSON.stringify(oldObj[k] ?? null) !== JSON.stringify(newObj[k] ?? null),
  }));
};

const AuditLogsPage = () => {
  const [patientNumeroInput, setPatientNumeroInput] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
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

  const MODULES = useMemo(() => {
    const set = new Set();
    ACTIONS.forEach((a) => {
      const parts = String(a).split("_");
      if (parts.length >= 2) parts.pop();
      set.add(parts.join("_"));
    });
    return Array.from(set).sort();
  }, []);

  const actionsForModule = useMemo(() => {
    if (!module) return ACTIONS;
    return ACTIONS.filter((a) => {
      const parts = String(a).split("_");
      if (parts.length >= 2) parts.pop();
      return parts.join("_") === module;
    });
  }, [module]);

  const diffRows = useMemo(() => {
    if (!details) return [];
    return buildDiffRows(details.old_data, details.new_data);
  }, [details]);

  const fetchPatient = async (numero) => {
    setLoading(true);
    try {
      const data = await getPatientAuditLogs(numero, {
        module: module || undefined,
        action: action || undefined,
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
  }, [module, action, from, to, offset]);

  useEffect(() => {
    if (!detailsOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeDetails();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detailsOpen]);

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
    <div className="audit audit--white">
      <header className="audit__header">
        <div>
          <h2 className="audit__title">Audit patient</h2>
          <p className="audit__subtitle">Module/Action en liste</p>
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
                setFrom("");
                setTo("");
              }}
              title="Réinitialiser"
            >
              <i className="bi bi-arrow-counterclockwise" /> Reset
            </button>
          </form>

          <div className="audit__filters">
            <div className="audit__field">
              <label className="audit__label">Module</label>
              <select
                className="audit__input"
                value={module}
                onChange={(e) => {
                  setOffset(0);
                  const nextModule = e.target.value;
                  setModule(nextModule);

                  if (nextModule && action) {
                    const aParts = String(action).split("_");
                    if (aParts.length >= 2) aParts.pop();
                    if (aParts.join("_") !== nextModule) setAction("");
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
                {actionsForModule.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
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
          <div className="auditTable">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 180 }}>Date</th>
                  <th style={{ width: 320 }}>Médecin</th>
                  <th style={{ width: 170 }}>Module</th>
                  <th style={{ width: 220 }}>Action</th>
                  <th style={{ width: 120 }} />
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="audit__cell audit__muted">
                      Chargement…
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="audit__cell audit__muted">
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

                      <td className="audit__cell">{txt(l.module)}</td>
                      <td className="audit__cell">{txt(l.action)}</td>

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
          <div className="auditModal__overlay" onClick={() => closeDetails()}>
            <div
              className="auditModal auditModal--compact"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Détails du log"
            >
              <div className="auditModal__header">
                <div className="auditModal__title">
                  <i className="bi bi-info-circle" /> Détails du log
                </div>

                <div className="auditModal__headerActions">
                  <button className="audit__btn audit__btn--sm" type="button" onClick={closeDetails}>
                    <i className="bi bi-x-lg" /> Fermer
                  </button>
                </div>
              </div>

              <div className="auditModal__body auditModal__body--scroll">
                {detailsLoading ? (
                  <div className="audit__muted">Chargement…</div>
                ) : !details ? (
                  <div className="audit__muted">Aucun détail.</div>
                ) : (
                  <>
                    {/* Removed the meta section you said you don't need:
                        Date / Médecin / Module / Action / Patient
                    */}

                    <div className="auditModal__meta2">
                      <div className="auditMetaRow">
                        <div className="auditMetaRow__k">IP</div>
                        <div className="auditMetaRow__v">{txt(details.ip_address)}</div>
                      </div>

                      <div className="auditMetaRow">
                        <div className="auditMetaRow__k">UA</div>
                        <div className="auditMetaRow__v auditMetaRow__v--mono">{txt(details.user_agent)}</div>
                      </div>

                    </div>

                    <div className="auditModal__section">Comparaison (old_data vs new_data)</div>

                    <div className="auditDiffTable">
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: 220 }}>Champ</th>
                            <th>Ancien</th>
                            <th>Nouveau</th>
                          </tr>
                        </thead>
                        <tbody>
                          {diffRows.length === 0 ? (
                            <tr>
                              <td className="auditDiff__cell" colSpan={3}>
                                <span className="audit__muted">Aucune donnée à comparer.</span>
                              </td>
                            </tr>
                          ) : (
                            diffRows.map((r) => (
                              <tr key={r.key} className={r.changed ? "auditDiff__row--changed" : ""}>
                                <td className="auditDiff__cell auditDiff__key">{r.key}</td>
                                <td className="auditDiff__cell auditDiff__mono">{prettyValue(r.oldValue)}</td>
                                <td className="auditDiff__cell auditDiff__mono">{prettyValue(r.newValue)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
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