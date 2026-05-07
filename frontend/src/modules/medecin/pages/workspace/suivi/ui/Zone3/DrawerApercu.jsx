import { Drawer, Descriptions, Tag, Divider } from "antd";
import { COULEURS_TYPE_BILAN } from "../../constants/suiviConstants";
import {
  DRAWER_SECTIONS,
  displayOrDash,
  getTraitementItems,
  hasSectionData,
  hasValue,
} from "./drawerApercuHelpers";

const DescItem = ({ label, value, render }) => (
  <Descriptions.Item label={label}>
    {hasValue(value) ? (render ? render(value) : value) : "-"}
  </Descriptions.Item>
);

const Section = ({ title, row, fields, items }) => {
  if (!hasSectionData(row, fields)) return null;

  return (
    <>
      <Divider
        titlePlacement="left"
        styles={{ content: { margin: 0 } }}
        className="drawer-apercu-divider"
      >
        {title}
      </Divider>

      <Descriptions column={2} size="small" bordered>
        {items.map((item) => (
          <DescItem
            key={`${title}-${item.label}`}
            label={item.label}
            value={row[item.key]}
            render={item.render}
          />
        ))}
      </Descriptions>
    </>
  );
};

const TraitementSection = ({ row }) => {
  if (!hasSectionData(row, ["traitement_date_debut"])) return null;

  return (
    <>
      <Divider
        titlePlacement="left"
        styles={{ content: { margin: 0 } }}
        className="drawer-apercu-divider"
      >
        Traitement ARV
      </Divider>

      <Descriptions column={2} size="small" bordered>
        {getTraitementItems(row).map((item) => (
          <Descriptions.Item key={`traitement-${item.label}`} label={item.label}>
            {typeof item.value === "object" && item.value !== null ? (
              <Tag color={item.value.color}>{item.value.label}</Tag>
            ) : hasValue(item.value) ? (
              item.render ? item.render(item.value) : item.value
            ) : (
              "-"
            )}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </>
  );
};

const DrawerApercu = ({ row, open, onClose }) => {
  if (!row) return null;

  return (
    <Drawer
      title="Détail du bilan"
      placement="right"
      size="large"
      open={open}
      onClose={onClose}
    >
      <div className="drawer-apercu-tag">
        <Tag color={COULEURS_TYPE_BILAN[row.type_bilan] ?? "default"}>
          {displayOrDash(row.type_bilan)}
        </Tag>
      </div>

      {DRAWER_SECTIONS.map((section) => (
        <Section
          key={section.title}
          title={section.title}
          row={row}
          fields={section.fields}
          items={section.items}
        />
      ))}

      <TraitementSection row={row} />

      <Divider
        titlePlacement="left"
        styles={{ content: { margin: 0 } }}
        className="drawer-apercu-divider"
      >
        Observations
      </Divider>

      <p className="drawer-apercu-observations">
        {displayOrDash(row.observations)}
      </p>
    </Drawer>
  );
};

export default DrawerApercu;
