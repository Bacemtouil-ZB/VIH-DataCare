// ============================================================
//  TableauSuivi.jsx
//  Zone 3 — Tableau chronologique bilans biologiques
//  Reçoit: data=[] loading=boolean onApercu=(row)=>void
// ============================================================

import { Table, Tag, Button, Spin, Empty } from "antd";
import {
  formatDate,
  formatCD4,
  formatCV,
  formatHGB,
  getCD4AntColor,
  getCVAntColor,
  getHGBAntColor,
} from "../../helpers/suiviHelpers";
import {
  COULEURS_STATUT,
  COULEURS_TYPE_BILAN,
  UNITES,
  MESSAGES_VIDES,
} from "../../constants/suiviConstants";

const TableauSuivi = ({ data = [], loading, onApercu }) => {
  const columns = [
    // ── Date ────────────────────────────────────────────────
    {
      title: "Date CD4",
      dataIndex: "date_cd4",
      key: "date_cd4",
      width: 110,
      render: (val) => formatDate(val),
      sorter: (a, b) =>
        new Date(a.date_tri) - new Date(b.date_tri),
      defaultSortOrder: "descend",
    },
    {
      title: "Date CV",
      dataIndex: "date_cv",
      key: "date_cv",
      width: 110,
      render: (val) => formatDate(val),
    },

    // ── CD4 ─────────────────────────────────────────────────
    {
      title: `CD4 (${UNITES.CD4})`,
      dataIndex: "cd4_absolu",
      key: "cd4_absolu",
      width: 120,
      render: (val) => (
        <span style={{ color: `var(--ant-color-${getCD4AntColor(val)})`, fontWeight: 500 }}>
          {formatCD4(val)}
        </span>
      ),
      sorter: (a, b) => (a.cd4_absolu ?? 0) - (b.cd4_absolu ?? 0),
    },

    // ── Charge virale ────────────────────────────────────────
    {
      title: `CV (${UNITES.CV})`,
      dataIndex: "charge_virale_valeur",
      key: "charge_virale_valeur",
      width: 140,
      render: (val) => (
        <span style={{ color: `var(--ant-color-${getCVAntColor(val)})`, fontWeight: 500 }}>
          {formatCV(val)}
        </span>
      ),
      sorter: (a, b) =>
        (a.charge_virale_valeur ?? 0) - (b.charge_virale_valeur ?? 0),
    },

    // ── Hémoglobine ──────────────────────────────────────────
    {
      title: `HGB (${UNITES.HGB})`,
      dataIndex: "hemoglobine",
      key: "hemoglobine",
      width: 110,
      render: (val) => (
        <span style={{ color: `var(--ant-color-${getHGBAntColor(val)})` }}>
          {formatHGB(val)}
        </span>
      ),
    },

    // ── Traitement ───────────────────────────────────────────
    {
      title: "Traitement ARV",
      dataIndex: "traitement",
      key: "traitement",
      width: 150,
      ellipsis: true,
      render: (val, row) =>
        val ? (
          <span title={val} style={{ fontSize: 12 }}>
            {row.traitement_code ?? val}
          </span>
        ) : (
          <span style={{ color: "var(--color-text-tertiary)" }}>---</span>
        ),
    },

    // ── Statut ───────────────────────────────────────────────
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      width: 100,
      render: (val) => (
        <Tag color={COULEURS_STATUT[val] ?? "default"}>{val ?? "Inconnu"}</Tag>
      ),
      filters: [
        { text: "Bon",      value: "Bon" },
        { text: "Moyen",    value: "Moyen" },
        { text: "Critique", value: "Critique" },
        { text: "Inconnu",  value: "Inconnu" },
      ],
      onFilter: (value, record) => record.statut === value,
    },

    // ── Type bilan ───────────────────────────────────────────
    {
      title: "Type",
      dataIndex: "type_bilan",
      key: "type_bilan",
      width: 90,
      render: (val) => (
        <Tag color={COULEURS_TYPE_BILAN[val] ?? "default"}>{val}</Tag>
      ),
      filters: [
        { text: "Initial", value: "Initial" },
        { text: "Suivi",   value: "Suivi" },
      ],
      onFilter: (value, record) => record.type_bilan === value,
    },

    // ── Action aperçu ────────────────────────────────────────
    {
      title: "",
      key: "action",
      width: 80,
      render: (_, row) => (
        <Button
          size="small"
          type="link"
          onClick={() => onApercu?.(row)}
        >
          Détail
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      size="small"
      pagination={{ pageSize: 10, showSizeChanger: true }}
      locale={{ emptyText: <Empty description={MESSAGES_VIDES.tableau} /> }}
      scroll={{ x: 900 }}
      rowClassName={(row) =>
        row.statut === "Critique" ? "row-critique" : ""
      }
      style={{ marginTop: 8 }}
    />
  );
};

export default TableauSuivi;