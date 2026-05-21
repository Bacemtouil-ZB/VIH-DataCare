import { Empty, Tag } from "antd";
import {
  formatDate,
  formatCD4,
  formatCV,
  formatCreatinine,
  getCD4AntColor,
  getCVAntColor,
  getCreatinineAntColor,
} from "../../helpers/suiviHelpers";
import {
  COULEURS_TYPE_BILAN,
  MESSAGES_VIDES,
  UNITES,
} from "../../constants/suiviConstants";

export const renderColoredMetric = (value, formatter, colorKey) => (
  <span className={`tableau-suivi-metric tableau-suivi-metric-${colorKey(value)}`}>
    {formatter(value)}
  </span>
);

export const renderTraitementValue = (value, row) =>
  value ? (
    <span className="tableau-suivi-traitement" title={value}>
      {row.traitement_code ?? value}
    </span>
  ) : (
    <span className="tableau-suivi-empty-value">---</span>
  );

export const createTableauColumns = () => [
  {
    title: "Date CD4",
    dataIndex: "date_cd4",
    key: "date_cd4",
    width: 110,
    render: (value) => formatDate(value),
    sorter: (left, right) => new Date(left.date_tri) - new Date(right.date_tri),
    defaultSortOrder: "descend",
  },
  {
    title: "Date CV",
    dataIndex: "date_cv",
    key: "date_cv",
    width: 110,
    render: (value) => formatDate(value),
  },
  {
    title: `CD4 (${UNITES.CD4})`,
    dataIndex: "cd4_absolu",
    key: "cd4_absolu",
    width: 120,
    render: (value) => renderColoredMetric(value, formatCD4, getCD4AntColor),
    sorter: (left, right) => (left.cd4_absolu ?? 0) - (right.cd4_absolu ?? 0),
  },
  {
    title: `CV (${UNITES.CV})`,
    dataIndex: "charge_virale_valeur",
    key: "charge_virale_valeur",
    width: 140,
    render: (value) => renderColoredMetric(value, formatCV, getCVAntColor),
    sorter: (left, right) =>
      (left.charge_virale_valeur ?? 0) - (right.charge_virale_valeur ?? 0),
  },
  {
    title: `Créatinine (${UNITES.CREATININE})`,
    dataIndex: "creatinine",
    key: "creatinine",
    width: 130,
    render: (value) => renderColoredMetric(value, formatCreatinine, getCreatinineAntColor),
  },
  {
    title: "Traitement ARV",
    dataIndex: "traitement",
    key: "traitement",
    width: 150,
    ellipsis: true,
    render: renderTraitementValue,
  },
  {
    title: "Type",
    dataIndex: "type_bilan",
    key: "type_bilan",
    width: 90,
    render: (value) => (
      <Tag color={COULEURS_TYPE_BILAN[value] ?? "default"}>
        {value}
      </Tag>
    ),
    filters: [
      { text: "Initial", value: "Initial" },
      { text: "Contrôle", value: "Contrôle" },
    ],
    onFilter: (value, record) => record.type_bilan === value,
  },
];

export const getTableauLocale = () => ({
  emptyText: <Empty description={MESSAGES_VIDES.tableau} />,
});