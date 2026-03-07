import React, { useEffect, useMemo, useState } from "react";
import {
  getGlobalAuditLogs,
  getPatientAuditLogs,
  getAuditLogDetails,
} from "../services/auditService"; // adjust path
import { toast } from "react-toastify";

const DEFAULT_LIMIT = 50;

const AuditLogsPage = () => {
  // scope: global | patient
  const [scope, setScope] = useState("global");

  // patient exact search
  const [patientNumeroInput, setPatientNumeroInput] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null); // returned by API in patient mode

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

  // details modal (simple)
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState(null);

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit],
  );

  const fetchGlobal = async () => {
    setLoading(true);
    try {
      const data = await getGlobalAuditLogs({
        module: module || undefined,
        action: action || undefined,
        anomaly: anomaly || undefined,
        from: from || undefined,
        to: to || undefined,
        limit,
        offset,
      });

      setLogs(data.logs || []);
      setTotal(data.total ?? 0);
    } catch (err) {
      toast.error(err?.message || "Erreur chargement audit global");
    } finally {
      setLoading(false);
    }
  };

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

  // default load: global
  useEffect(() => {
    if (scope === "global") {
      fetchGlobal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, limit, offset]);

  // when filters change, reset pagination and refetch depending on scope
  useEffect(() => {
    setOffset(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, action, anomaly, from, to, limit, scope]);

  useEffect(() => {
    if (scope === "global") {
      fetchGlobal();
      return;
    }

    // patient mode: only fetch if we already selected/searched a patient
    if (scope === "patient" && selectedPatient?.numero) {
      fetchPatient(selectedPatient.numero);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, action, anomaly, from, to, limit, offset, scope]);

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

  const onChangeScope = (nextScope) => {
    setScope(nextScope);
    setLogs([]);
    setTotal(0);
    setOffset(0);
    setSelectedPatient(null);
    setSelectedLogDetails(null);
    setDetailsOpen(false);
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

  const nextPage = () => {
    if (page < totalPages) setOffset(offset + limit);
  };

  const prevPage = () => {
    if (page > 1) setOffset(Math.max(0, offset - limit));
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Audit & Traçabilité</h2>

      {/* Scope switch */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => onChangeScope("global")}
          disabled={scope === "global"}
        >
          Global
        </button>
        <button
          type="button"
          onClick={() => onChangeScope("patient")}
          disabled={scope === "patient"}
        >
          Par patient
        </button>
      </div>

      {/* Patient search */}
      {scope === "patient" && (
        <form onSubmit={onSearchPatient} style={{ marginBottom: 12 }}>
          <label>
            Numéro patient (exact):{" "}
            <input
              value={patientNumeroInput}
              onChange={(e) => setPatientNumeroInput(e.target.value)}
              placeholder="Ex: VIH-2026-001"
            />
          </label>
          <button type="submit" style={{ marginLeft: 8 }}>
            Rechercher
          </button>

          {selectedPatient && (
            <div style={{ marginTop: 8 }}>
              <strong>Patient:</strong> {selectedPatient.numero} —{" "}
              {selectedPatient.name} {selectedPatient.surname}
            </div>
          )}
        </form>
      )}

      {/* Filters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <input
          value={module}
          onChange={(e) => setModule(e.target.value)}
          placeholder="Module (ex: VIH)"
        />
        <input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Action (ex: VIH_UPDATE)"
        />
        <select value={anomaly} onChange={(e) => setAnomaly(e.target.value)}>
          <option value="">Anomalie: Tous</option>
          <option value="true">Anomalie: Oui</option>
          <option value="false">Anomalie: Non</option>
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #ddd", borderRadius: 6, overflow: "auto" }}>
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "#f6f6f6" }}>
            <tr>
              <th align="left">Date</th>
              <th align="left">Utilisateur</th>
              <th align="left">Rôle</th>
              <th align="left">Patient</th>
              <th align="left">Module</th>
              <th align="left">Action</th>
              <th align="left">IP</th>
              <th align="left">Anomalie</th>
              <th align="left">Détails</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9">Chargement...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="9">Aucun log</td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id} style={{ borderTop: "1px solid #eee" }}>
                  <td>{new Date(l.created_at).toLocaleString()}</td>
                  <td>
                    {l.user_nom} {l.user_prenom}{" "}
                    <span style={{ color: "#666" }}>({l.user_email})</span>
                  </td>
                  <td>{l.user_role}</td>
                  <td>{l.patient_numero || "—"}</td>
                  <td>{l.module}</td>
                  <td>{l.action}</td>
                  <td>{l.ip_address || "—"}</td>
                  <td>{l.is_anomaly ? "Oui" : "Non"}</td>
                  <td>
                    <button type="button" onClick={() => openDetails(l.id)}>
                      Voir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <div>
          Total: <strong>{total}</strong> — Page {page}/{totalPages}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={prevPage} disabled={page <= 1}>
            Précédent
          </button>
          <button type="button" onClick={nextPage} disabled={page >= totalPages}>
            Suivant
          </button>
        </div>
      </div>

      {/* Details Modal (simple inline modal) */}
      {detailsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setDetailsOpen(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: 8, maxWidth: 900, width: "100%", padding: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Détails du log</h3>

            {detailsLoading ? (
              <div>Chargement...</div>
            ) : !selectedLogDetails ? (
              <div>Aucun détail.</div>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}>
                  <div><strong>Date:</strong> {new Date(selectedLogDetails.created_at).toLocaleString()}</div>
                  <div>
                    <strong>Utilisateur:</strong> {selectedLogDetails.user_nom} {selectedLogDetails.user_prenom} ({selectedLogDetails.user_email})
                  </div>
                  <div><strong>Action:</strong> {selectedLogDetails.action}</div>
                  <div><strong>Module:</strong> {selectedLogDetails.module}</div>
                  <div><strong>Patient:</strong> {selectedLogDetails.patient_numero || "—"}</div>
                  <div><strong>IP:</strong> {selectedLogDetails.ip_address || "—"}</div>
                  <div><strong>User-Agent:</strong> {selectedLogDetails.user_agent || "—"}</div>
                  <div><strong>Request ID:</strong> {selectedLogDetails.request_id || "—"}</div>
                  <div><strong>Session ID:</strong> {selectedLogDetails.session_id || "—"}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <h4>Anciennes données (old_data)</h4>
                    <pre style={{ background: "#f7f7f7", padding: 12, borderRadius: 6, maxHeight: 350, overflow: "auto" }}>
                      {JSON.stringify(selectedLogDetails.old_data, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4>Nouvelles données (new_data)</h4>
                    <pre style={{ background: "#f7f7f7", padding: 12, borderRadius: 6, maxHeight: 350, overflow: "auto" }}>
                      {JSON.stringify(selectedLogDetails.new_data, null, 2)}
                    </pre>
                  </div>
                </div>
              </>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button type="button" onClick={() => setDetailsOpen(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsPage;