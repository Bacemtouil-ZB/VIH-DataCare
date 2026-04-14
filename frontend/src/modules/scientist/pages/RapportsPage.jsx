import { useState, useEffect, useCallback } from "react";
import { Button, Input, Select, Divider, Typography, Space, message } from "antd";
import { PrinterOutlined, SaveOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

/* ─── constantes ─── */
const TRANCHES = ["<1an","1-4ans","5-9ans","10-14ans","15-19ans","20-24ans","25-49ans",">50ans"];
const LIEUX    = ["CCDAG","ONG","HOPITAL","BANQUE DE SANG","LABORATOIRE PRIVE","DEPISTAGE PRENATAL","AUTRE","NON PRECISE"];
const PROTOCOLES = ["Acriptega","Dolu/Lami/Teno","2ème ligne","3ème ligne","Autres"];
const STORAGE_KEY = "rapport_vih_v1";

/* ─── helpers ─── */
const emptyGrid = () =>
  Object.fromEntries(TRANCHES.map((t) => [t, { homme: "", femme: "" }]));

const sumGrid = (grid) => {
  let th = 0, tf = 0;
  TRANCHES.forEach((t) => {
    th += Number(grid[t]?.homme) || 0;
    tf += Number(grid[t]?.femme) || 0;
  });
  return { homme: th, femme: tf, total: th + tf };
};

const colTotal = (grid, t) =>
  (Number(grid[t]?.homme) || 0) + (Number(grid[t]?.femme) || 0);

const initState = () => ({
  hopital: "",
  periode: "",
  typeRapport: "trimestriel",

  /* I. Nouveaux malades */
  nouveaux: emptyGrid(),
  lieux: Object.fromEntries(LIEUX.map((l) => [l, ""])),

  /* Diagnostic tardif */
  cd4lt200: emptyGrid(),
  cd4_200_350: emptyGrid(),

  /* Protocoles */
  protocoles: Object.fromEntries(
    PROTOCOLES.map((p) => [p, { homme: "", femme: "" }])
  ),

  /* Profil patients */
  ps:        { lt25: "", gte25: "" },
  hsh:       { lt25: "", gte25: "" },
  udi:       { lt25: "", gte25: "" },
  detenus:   { lt25: "", gte25: "" },
  transgenres:{ lt25: "", gte25: "" },
  serodiscordants: "",

  /* Coinf HVB */
  hvb_depist:   { lt15: "", gte15: "" },
  hvb_coinf:    { lt15: "", gte15: "" },
  hvb_traite:   { lt15: "", gte15: "" },
  hvb_pop: Object.fromEntries(["PS","UDI","HSH","DETENUS","TRANSGENRES","AUTRES","NON NOTIFIE"].map(k=>[k,""])),

  /* Coinf HVC */
  hvc_depist:   { lt15: "", gte15: "" },
  hvc_coinf:    { lt15: "", gte15: "" },
  hvc_pop: Object.fromEntries(["PS","UDI","HSH","DETENUS","TRANSGENRES","AUTRES","NON NOTIFIE"].map(k=>[k,""])),

  /* TB */
  tb_recherche: { hlt15:"", hgte15:"", flt15:"", fgte15:"" },
  tb_arv_tb:    { hlt15:"", hgte15:"", flt15:"", fgte15:"" },
  tb_tb_arv:    { hlt15:"", hgte15:"", flt15:"", fgte15:"" },
  tb_inh:       { hlt15:"", hgte15:"", flt15:"", fgte15:"" },

  /* Migrants */
  migrants: { hlt15:"", hgte15:"", flt15:"", fgte15:"" },

  /* File active */
  cv_controle:   emptyGrid(),
  cv_lt1000:     emptyGrid(),
  cv_lt50:       emptyGrid(),

  /* Passage stades */
  deces:   { hlt5:"", h5_14:"", hgte15:"", flt5:"", f5_14:"", fgte15:"" },
  perdus:  { hlt5:"", h5_14:"", hgte15:"", flt5:"", f5_14:"", fgte15:"" },
  transferts:{ hlt5:"", h5_14:"", hgte15:"", flt5:"", f5_14:"", fgte15:"" },
  recuperation: emptyGrid(),
  fileActive: emptyGrid(),
});

/* ─── sous-composants ─── */
const N = ({ value, onChange, small }) => (
  <Input
    value={value}
    onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
    style={{
      width: small ? 52 : 64,
      textAlign: "center",
      fontSize: 12,
      padding: "2px 4px",
    }}
    placeholder="0"
  />
);

const TotalCell = ({ val }) => (
  <td style={styles.tdTotal}>{val || 0}</td>
);

/* Tableau tranche d'âge × Hommes/Femmes/Total */
const AgeGrid = ({ label, grid, onChange }) => {
  const sums = sumGrid(grid);
  return (
    <div style={{ overflowX: "auto", marginBottom: 16 }}>
      {label && <Text strong style={{ fontSize: 12 }}>{label}</Text>}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}></th>
            {TRANCHES.map((t) => <th key={t} style={styles.th}>{t}</th>)}
            <th style={styles.th}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {["homme","femme"].map((genre) => (
            <tr key={genre}>
              <td style={styles.tdLabel}>{genre === "homme" ? "Hommes" : "Femmes"}</td>
              {TRANCHES.map((t) => (
                <td key={t} style={styles.td}>
                  <N
                    value={grid[t][genre]}
                    onChange={(v) => onChange(t, genre, v)}
                  />
                </td>
              ))}
              <TotalCell val={sums[genre]} />
            </tr>
          ))}
          <tr>
            <td style={styles.tdLabel}>Total</td>
            {TRANCHES.map((t) => <TotalCell key={t} val={colTotal(grid, t)} />)}
            <TotalCell val={sums.total} />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

/* Tableau lt25 / gte25 / total */
const ProfilRow = ({ label, data, onChange }) => (
  <tr>
    <td style={styles.tdLabel}>{label}</td>
    <td style={styles.td}><N value={data.lt25} onChange={(v) => onChange("lt25", v)} /></td>
    <td style={styles.td}><N value={data.gte25} onChange={(v) => onChange("gte25", v)} /></td>
    <TotalCell val={(Number(data.lt25)||0)+(Number(data.gte25)||0)} />
  </tr>
);

/* Tableau lt15 / gte15 / total */
const AgeSimple = ({ data, onChange }) => (
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.th}>{"< 15 ans"}</th>
        <th style={styles.th}>{"> 15 ans"}</th>
        <th style={styles.th}>TOTAL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={styles.td}><N value={data.lt15} onChange={(v) => onChange("lt15", v)} /></td>
        <td style={styles.td}><N value={data.gte15} onChange={(v) => onChange("gte15", v)} /></td>
        <TotalCell val={(Number(data.lt15)||0)+(Number(data.gte15)||0)} />
      </tr>
    </tbody>
  </table>
);

/* Tableau TB : Hommes/Femmes × lt15/gte15 */
const TbGrid = ({ data, onChange }) => {
  const htot = (Number(data.hlt15)||0)+(Number(data.hgte15)||0);
  const ftot = (Number(data.flt15)||0)+(Number(data.fgte15)||0);
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}></th>
          <th style={styles.th}>{"< 15 ans"}</th>
          <th style={styles.th}>{"> 15 ans"}</th>
          <th style={styles.th}>TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={styles.tdLabel}>Hommes</td>
          <td style={styles.td}><N value={data.hlt15} onChange={(v)=>onChange("hlt15",v)}/></td>
          <td style={styles.td}><N value={data.hgte15} onChange={(v)=>onChange("hgte15",v)}/></td>
          <TotalCell val={htot}/>
        </tr>
        <tr>
          <td style={styles.tdLabel}>Femmes</td>
          <td style={styles.td}><N value={data.flt15} onChange={(v)=>onChange("flt15",v)}/></td>
          <td style={styles.td}><N value={data.fgte15} onChange={(v)=>onChange("fgte15",v)}/></td>
          <TotalCell val={ftot}/>
        </tr>
        <tr>
          <td style={styles.tdLabel}>TOTAL</td>
          <TotalCell val={(Number(data.hlt15)||0)+(Number(data.flt15)||0)}/>
          <TotalCell val={(Number(data.hgte15)||0)+(Number(data.fgte15)||0)}/>
          <TotalCell val={htot+ftot}/>
        </tr>
      </tbody>
    </table>
  );
};

/* Tableau passage stades lt5 / 5-14 / gte15 */
const StadeGrid = ({ data, onChange }) => {
  const htot = (Number(data.hlt5)||0)+(Number(data.h5_14)||0)+(Number(data.hgte15)||0);
  const ftot = (Number(data.flt5)||0)+(Number(data.f5_14)||0)+(Number(data.fgte15)||0);
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}></th>
          <th style={styles.th}>{"< 5 ans"}</th>
          <th style={styles.th}>5-14 ans</th>
          <th style={styles.th}>{"> 15 ans"}</th>
          <th style={styles.th}>TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={styles.tdLabel}>Hommes</td>
          <td style={styles.td}><N value={data.hlt5}  onChange={(v)=>onChange("hlt5",v)}/></td>
          <td style={styles.td}><N value={data.h5_14} onChange={(v)=>onChange("h5_14",v)}/></td>
          <td style={styles.td}><N value={data.hgte15}onChange={(v)=>onChange("hgte15",v)}/></td>
          <TotalCell val={htot}/>
        </tr>
        <tr>
          <td style={styles.tdLabel}>Femmes</td>
          <td style={styles.td}><N value={data.flt5}  onChange={(v)=>onChange("flt5",v)}/></td>
          <td style={styles.td}><N value={data.f5_14} onChange={(v)=>onChange("f5_14",v)}/></td>
          <td style={styles.td}><N value={data.fgte15}onChange={(v)=>onChange("fgte15",v)}/></td>
          <TotalCell val={ftot}/>
        </tr>
        <tr>
          <td style={styles.tdLabel}>TOTAL</td>
          <TotalCell val={(Number(data.hlt5)||0)+(Number(data.flt5)||0)}/>
          <TotalCell val={(Number(data.h5_14)||0)+(Number(data.f5_14)||0)}/>
          <TotalCell val={(Number(data.hgte15)||0)+(Number(data.fgte15)||0)}/>
          <TotalCell val={htot+ftot}/>
        </tr>
      </tbody>
    </table>
  );
};

const SectionTitle = ({ children }) => (
  <div style={styles.sectionTitle}>{children}</div>
);

const SubTitle = ({ children }) => (
  <div style={styles.subTitle}>{children}</div>
);

/* ─── styles ─── */
const styles = {
  page: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px", fontFamily: "Arial, sans-serif" },
  header: { textAlign: "center", marginBottom: 24, borderBottom: "2px solid #333", paddingBottom: 16 },
  table: { borderCollapse: "collapse", width: "100%", fontSize: 12, marginBottom: 8 },
  th: { border: "1px solid #aaa", padding: "4px 6px", background: "#e8e8e8", textAlign: "center", fontSize: 11, fontWeight: "bold", whiteSpace: "nowrap" },
  td: { border: "1px solid #ccc", padding: "3px 4px", textAlign: "center" },
  tdLabel: { border: "1px solid #ccc", padding: "4px 8px", fontWeight: "bold", fontSize: 12, background: "#f5f5f5", whiteSpace: "nowrap" },
  tdTotal: { border: "1px solid #ccc", padding: "4px 8px", textAlign: "center", fontWeight: "bold", background: "#f0f0f0", fontSize: 12 },
  sectionTitle: { background: "#1a3a5c", color: "#fff", padding: "6px 12px", fontWeight: "bold", fontSize: 13, marginBottom: 12, marginTop: 20 },
  subTitle: { background: "#d6e4f0", padding: "4px 10px", fontWeight: "bold", fontSize: 12, marginBottom: 8, marginTop: 12, borderLeft: "3px solid #1a3a5c" },
  toolbar: { display: "flex", gap: 8, marginBottom: 20, padding: "12px 16px", background: "#f0f4f8", borderRadius: 8, alignItems: "center", flexWrap: "wrap" },
  saved: { fontSize: 11, color: "#52c41a" },
};

/* ─── composant principal ─── */
const RapportVIH = () => {
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initState();
    } catch { return initState(); }
  });
  const [lastSaved, setLastSaved] = useState(null);

  /* sauvegarde auto toutes les 30s */
  useEffect(() => {
    const id = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setLastSaved(new Date().toLocaleTimeString("fr-FR"));
    }, 30000);
    return () => clearInterval(id);
  }, [form]);

  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setLastSaved(new Date().toLocaleTimeString("fr-FR"));
    message.success("Données sauvegardées");
  }, [form]);

  const reset = () => {
    if (window.confirm("Réinitialiser tout le formulaire ?")) {
      const fresh = initState();
      setForm(fresh);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      message.info("Formulaire réinitialisé");
    }
  };

  /* setters génériques */
  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const setGrid = (key, t, genre, val) =>
    setForm((f) => ({ ...f, [key]: { ...f[key], [t]: { ...f[key][t], [genre]: val } } }));

  const setNested = (key, subkey, val) =>
    setForm((f) => ({ ...f, [key]: { ...f[key], [subkey]: val } }));

  const setProfilField = (key, subkey, val) =>
    setForm((f) => ({ ...f, [key]: { ...f[key], [subkey]: val } }));

  return (
    <div style={styles.page}>

      {/* ── Barre d'outils ── */}
      <div style={styles.toolbar} className="no-print">
        <Button icon={<SaveOutlined />} type="primary" onClick={save}>
          Sauvegarder
        </Button>
        <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
          Imprimer / PDF
        </Button>
        <Button icon={<ReloadOutlined />} danger onClick={reset}>
          Réinitialiser
        </Button>
        {lastSaved && (
          <span style={styles.saved}>✓ Sauvegardé à {lastSaved}</span>
        )}
      </div>

      {/* ── En-tête ── */}
      <div style={styles.header}>
        <div style={{ fontSize: 11, marginBottom: 4 }}>MINISTERE DE LA SANTE</div>
        <div style={{ fontSize: 11, marginBottom: 4 }}>DIRECTION DES SOINS DE SANTE DE BASE</div>
        <div style={{ fontSize: 11, marginBottom: 8 }}>PROGRAMME NATIONAL DE LUTTE CONTRE LE SIDA ET LES IST</div>
        <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 8 }}>
          BILAN DES ACTIVITES DE PRISE EN CHARGE DES PERSONNES VIVANT AVEC LE VIH DANS LES CENTRES DE REFERENCES
        </div>
        <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 16 }}>
          RAPPORT DE LA RIPOSTE NATIONALE
        </div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", fontSize: 12 }}>
          <span>
            HOPITAL :{" "}
            <Input
              value={form.hopital}
              onChange={(e) => setField("hopital", e.target.value)}
              style={{ width: 220, fontSize: 12 }}
              placeholder="Nom de l'hôpital"
            />
          </span>
          <span>
            RAPPORT :{" "}
            <Select
              value={form.typeRapport}
              onChange={(v) => setField("typeRapport", v)}
              style={{ width: 150, fontSize: 12 }}
              options={[
                { label: "Trimestriel", value: "trimestriel" },
                { label: "Annuel",      value: "annuel" },
              ]}
            />
          </span>
          <span>
            PÉRIODE :{" "}
            <Input
              value={form.periode}
              onChange={(e) => setField("periode", e.target.value)}
              style={{ width: 130, fontSize: 12 }}
              placeholder="ex: T1 2025"
            />
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          I. NOUVEAUX MALADES
      ══════════════════════════════════════ */}
      <SectionTitle>I. NOUVEAUX MALADES</SectionTitle>

      <SubTitle>Nombre de PVVIH ayant nouvellement dépistés</SubTitle>
      <AgeGrid
        grid={form.nouveaux}
        onChange={(t, g, v) => setGrid("nouveaux", t, g, v)}
      />

      <SubTitle>Lieu de dépistage (pour les NOUVEAUX)</SubTitle>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>LIEU</th>
            <th style={styles.th}>Nombre de personnes testées positives</th>
          </tr>
        </thead>
        <tbody>
          {LIEUX.map((l) => (
            <tr key={l}>
              <td style={styles.tdLabel}>{l}</td>
              <td style={styles.td}>
                <N
                  value={form.lieux[l]}
                  onChange={(v) => setForm((f) => ({ ...f, lieux: { ...f.lieux, [l]: v } }))}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td style={styles.tdLabel}>TOTAL</td>
            <TotalCell val={LIEUX.reduce((s, l) => s + (Number(form.lieux[l]) || 0), 0)} />
          </tr>
        </tbody>
      </table>

      <SubTitle>Diagnostic tardif — Taux initial de CD4 &lt; 200 /mm³</SubTitle>
      <AgeGrid
        grid={form.cd4lt200}
        onChange={(t, g, v) => setGrid("cd4lt200", t, g, v)}
      />

      <SubTitle>Diagnostic tardif — Taux initial de CD4 entre 200 et 350 /mm³</SubTitle>
      <AgeGrid
        grid={form.cd4_200_350}
        onChange={(t, g, v) => setGrid("cd4_200_350", t, g, v)}
      />

      <SubTitle>Protocoles thérapeutiques (pour les NOUVEAUX)</SubTitle>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}></th>
            {PROTOCOLES.map((p) => <th key={p} style={styles.th}>{p}</th>)}
          </tr>
        </thead>
        <tbody>
          {["homme","femme"].map((g) => (
            <tr key={g}>
              <td style={styles.tdLabel}>{g === "homme" ? "Hommes" : "Femmes"}</td>
              {PROTOCOLES.map((p) => (
                <td key={p} style={styles.td}>
                  <N
                    value={form.protocoles[p][g]}
                    onChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        protocoles: { ...f.protocoles, [p]: { ...f.protocoles[p], [g]: v } },
                      }))
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td style={styles.tdLabel}>Total</td>
            {PROTOCOLES.map((p) => (
              <TotalCell
                key={p}
                val={(Number(form.protocoles[p].homme)||0)+(Number(form.protocoles[p].femme)||0)}
              />
            ))}
          </tr>
        </tbody>
      </table>

      <SubTitle>Ventilation selon le profil des patients (pour les NOUVEAUX)</SubTitle>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Groupe</th>
            <th style={styles.th}>{"< 25 ans"}</th>
            <th style={styles.th}>{"≥ 25 ans"}</th>
            <th style={styles.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {[
            { key: "ps",          label: "Professionnelles du sexe (PS)" },
            { key: "hsh",         label: "HSH (hommes ayant des rel. sex. avec hommes)" },
            { key: "udi",         label: "Usagers de drogues injectables (UDI)" },
            { key: "detenus",     label: "Détenus" },
            { key: "transgenres", label: "Transgenres" },
          ].map(({ key, label }) => (
            <ProfilRow
              key={key}
              label={label}
              data={form[key]}
              onChange={(sk, v) => setProfilField(key, sk, v)}
            />
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 12 }}>
        <Text>Nombre de couples séro-discordants :</Text>
        <N value={form.serodiscordants} onChange={(v) => setField("serodiscordants", v)} />
      </div>

      {/* ── Coïnfection HVB ── */}
      <SectionTitle>Coïnfection VIH — Hépatite virale B</SectionTitle>

      <SubTitle>Personnes ayant bénéficié d'un dépistage de l'HVB</SubTitle>
      <AgeSimple data={form.hvb_depist} onChange={(sk,v)=>setNested("hvb_depist",sk,v)} />

      <SubTitle>Personnes Co-infectées VIH/VHB</SubTitle>
      <AgeSimple data={form.hvb_coinf} onChange={(sk,v)=>setNested("hvb_coinf",sk,v)} />

      <SubTitle>Personnes Co-infectées VIH/VHB ayant commencé un traitement contre l'HVB</SubTitle>
      <AgeSimple data={form.hvb_traite} onChange={(sk,v)=>setNested("hvb_traite",sk,v)} />

      <SubTitle>Ventilation VIH/VHB par population clés</SubTitle>
      <table style={styles.table}>
        <thead>
          <tr>
            {["PS","UDI","HSH","DETENUS","TRANSGENRES","AUTRES","NON NOTIFIE","TOTAL"].map(k=>(
              <th key={k} style={styles.th}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {["PS","UDI","HSH","DETENUS","TRANSGENRES","AUTRES","NON NOTIFIE"].map(k=>(
              <td key={k} style={styles.td}>
                <N value={form.hvb_pop[k]} onChange={(v)=>setForm(f=>({...f,hvb_pop:{...f.hvb_pop,[k]:v}}))} small />
              </td>
            ))}
            <TotalCell val={["PS","UDI","HSH","DETENUS","TRANSGENRES","AUTRES","NON NOTIFIE"].reduce((s,k)=>s+(Number(form.hvb_pop[k])||0),0)}/>
          </tr>
        </tbody>
      </table>

      {/* ── Coïnfection HVC ── */}
      <SectionTitle>Coïnfection VIH — Hépatite virale C</SectionTitle>

      <SubTitle>Personnes ayant bénéficié d'un dépistage de l'HVC</SubTitle>
      <AgeSimple data={form.hvc_depist} onChange={(sk,v)=>setNested("hvc_depist",sk,v)} />

      <SubTitle>Personnes Co-infectées VIH/HVC</SubTitle>
      <AgeSimple data={form.hvc_coinf} onChange={(sk,v)=>setNested("hvc_coinf",sk,v)} />

      <SubTitle>Ventilation VIH/HVC par population clés</SubTitle>
      <table style={styles.table}>
        <thead>
          <tr>
            {["PS","UDI","HSH","DETENUS","TRANSGENRES","AUTRES","NON NOTIFIE","TOTAL"].map(k=>(
              <th key={k} style={styles.th}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {["PS","UDI","HSH","DETENUS","TRANSGENRES","AUTRES","NON NOTIFIE"].map(k=>(
              <td key={k} style={styles.td}>
                <N value={form.hvc_pop[k]} onChange={(v)=>setForm(f=>({...f,hvc_pop:{...f.hvc_pop,[k]:v}}))} small />
              </td>
            ))}
            <TotalCell val={["PS","UDI","HSH","DETENUS","TRANSGENRES","AUTRES","NON NOTIFIE"].reduce((s,k)=>s+(Number(form.hvc_pop[k])||0),0)}/>
          </tr>
        </tbody>
      </table>

      {/* ── Coïnfection TB ── */}
      <SectionTitle>Coïnfection VIH / Tuberculose</SectionTitle>

      <SubTitle>PVVIH chez qui on a recherché une tuberculose latente</SubTitle>
      <TbGrid data={form.tb_recherche} onChange={(sk,v)=>setNested("tb_recherche",sk,v)} />

      <SubTitle>PVVIH sous ARV ayant commencé un traitement anti-tuberculeux</SubTitle>
      <TbGrid data={form.tb_arv_tb} onChange={(sk,v)=>setNested("tb_arv_tb",sk,v)} />

      <SubTitle>Patients atteints de TB ayant commencé un traitement ARV</SubTitle>
      <TbGrid data={form.tb_tb_arv} onChange={(sk,v)=>setNested("tb_tb_arv",sk,v)} />

      <SubTitle>PVVIH mis sous prophylaxie à l'INH + rifampicine contre la TB</SubTitle>
      <TbGrid data={form.tb_inh} onChange={(sk,v)=>setNested("tb_inh",sk,v)} />

      {/* ── Migrants ── */}
      <SectionTitle>Nombre total de migrants (dans la file active)</SectionTitle>
      <TbGrid data={form.migrants} onChange={(sk,v)=>setNested("migrants",sk,v)} />

      {/* ══════════════════════════════════════
          II. TOUTE LA FILE ACTIVE
      ══════════════════════════════════════ */}
      <SectionTitle>II. TOUTE LA FILE ACTIVE</SectionTitle>

      <SubTitle>Charge virale — PVVIH ayant eu une charge virale de contrôle (CV plus de 6 mois après début du ttt)</SubTitle>
      <AgeGrid
        grid={form.cv_controle}
        onChange={(t, g, v) => setGrid("cv_controle", t, g, v)}
      />

      <SubTitle>Suppression virale — PVVIH ayant eu une charge virale CV &lt; 1000 Copies/ml</SubTitle>
      <AgeGrid
        grid={form.cv_lt1000}
        onChange={(t, g, v) => setGrid("cv_lt1000", t, g, v)}
      />

      <SubTitle>PVVIH ayant eu une charge virale CV &lt; 50 Copies/ml</SubTitle>
      <AgeGrid
        grid={form.cv_lt50}
        onChange={(t, g, v) => setGrid("cv_lt50", t, g, v)}
      />

      {/* ── Passage des stades ── */}
      <SectionTitle>Passage des stades</SectionTitle>

      <SubTitle>Décès liés au sida</SubTitle>
      <StadeGrid data={form.deces} onChange={(sk,v)=>setNested("deces",sk,v)} />

      <SubTitle>Perdus de vue (depuis plus de 6 mois)</SubTitle>
      <StadeGrid data={form.perdus} onChange={(sk,v)=>setNested("perdus",sk,v)} />

      <SubTitle>Transferts</SubTitle>
      <StadeGrid data={form.transferts} onChange={(sk,v)=>setNested("transferts",sk,v)} />

      <SubTitle>Récupération des perdus de vue</SubTitle>
      <AgeGrid
        grid={form.recuperation}
        onChange={(t, g, v) => setGrid("recuperation", t, g, v)}
      />

      <SubTitle>Total des malades suivis — TOUTE LA FILE ACTIVE</SubTitle>
      <AgeGrid
        grid={form.fileActive}
        onChange={(t, g, v) => setGrid("fileActive", t, g, v)}
      />

      <div style={{ marginTop: 8, padding: "8px 10px", background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 4, fontSize: 11 }}>
        <strong>Note :</strong> Seules les personnes sous traitement sont comptabilisées. Exclure : décédées, émigrées, perdues de vue, ayant arrêté leur traitement.
      </div>

      {/* ── Bouton bas de page ── */}
      <div style={{ marginTop: 32, display: "flex", gap: 8, justifyContent: "flex-end" }} className="no-print">
        <Button icon={<SaveOutlined />} type="primary" size="large" onClick={save}>
          Sauvegarder
        </Button>
        <Button icon={<PrinterOutlined />} size="large" onClick={() => window.print()}>
          Imprimer / Exporter PDF
        </Button>
      </div>

      {/* ── CSS impression ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 10px; }
          input, .ant-input, .ant-select { border: none !important; box-shadow: none !important; }
          input { font-weight: bold; }
        }
      `}</style>
    </div>
  );
};

export default RapportVIH;