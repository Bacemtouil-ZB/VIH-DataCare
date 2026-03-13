//used for antecedents form 

import SectionCard from "./SectionCard";
import BoolGrid from "./BoolGrid";
import ListSection from "./ListSection";
import Field from "./Field";
import { Input } from "../../../../shared/components";
import Textarea from "./Textarea";

export default function SectionRenderer({
  active,
  form,
  BOOL_FIELDS,
  updateSection,
  updateList,
  addRow,
  removeRow,
  readOnly = false,
}) {
  const disabled = !!readOnly;

  switch (active) {
    case "medical":
      return (
        <SectionCard title="Antécédents Médicaux">
          <BoolGrid
            fields={BOOL_FIELDS.medical}
            data={form.medical}
            disabled={disabled}
            onChange={(k, v) => updateSection("medical", k, v)}
          />
          <div style={{ marginTop: 14 }}>
            <Field label="Autres">
              <Textarea
                disabled={disabled}
                value={form.medical.autres}
                onChange={(e) =>
                  updateSection("medical", "autres", e.target.value)
                }
                placeholder="Précisez d'autres antécédents médicaux…"
              />
            </Field>
          </div>
        </SectionCard>
      );

    case "infectious":
      return (
        <SectionCard title="Antécédents Infectieux">
          <BoolGrid
            fields={BOOL_FIELDS.infectious}
            data={form.infectious}
            disabled={disabled}
            onChange={(k, v) => updateSection("infectious", k, v)}
          />
        </SectionCard>
      );

    case "therapeutic":
      return (
        <SectionCard title="Antécédents Thérapeutiques">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Médicaments chroniques">
              <Textarea
                disabled={disabled}
                value={form.therapeutic.medicaments_chroniques}
                onChange={(e) =>
                  updateSection("therapeutic", "medicaments_chroniques", e.target.value)
                }
                placeholder="Listez les médicaments…"
              />
            </Field>
            <Field label="Automédication">
              <Textarea
                disabled={disabled}
                value={form.therapeutic.automedication}
                onChange={(e) =>
                  updateSection("therapeutic", "automedication", e.target.value)
                }
                placeholder="Précisez…"
              />
            </Field>
            <Field label="Médecines traditionnelles">
              <Textarea
                disabled={disabled}
                value={form.therapeutic.medecines_traditionnelles}
                onChange={(e) =>
                  updateSection(
                    "therapeutic",
                    "medecines_traditionnelles",
                    e.target.value,
                  )
                }
                placeholder="Précisez…"
              />
            </Field>
            <Field label="Allergies médicamenteuses">
              <Textarea
                disabled={disabled}
                value={form.therapeutic.allergies_medicaments}
                onChange={(e) =>
                  updateSection("therapeutic", "allergies_medicaments", e.target.value)
                }
                placeholder="Précisez les allergies…"
              />
            </Field>
          </div>
        </SectionCard>
      );

    case "surgical":
      return (
        <SectionCard title="Antécédents Chirurgicaux">
          <ListSection
            disabled={disabled}
            items={form.surgical}
            onAdd={() => addRow("surgical", { description: "", date_intervention: "" })}
            onRemove={(i) => removeRow("surgical", i)}
            addLabel="Ajouter une intervention"
            renderItem={(item, i) => (
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                <Field label="Description">
                  <Input
                    disabled={disabled}
                    value={item.description}
                    onChange={(e) => updateList("surgical", i, "description", e.target.value)}
                    placeholder="Type d'intervention…"
                  />
                </Field>
                <Field label="Date">
                  <Input
                    disabled={disabled}
                    type="date"
                    value={item.date_intervention}
                    onChange={(e) =>
                      updateList("surgical", i, "date_intervention", e.target.value)
                    }
                  />
                </Field>
              </div>
            )}
          />
        </SectionCard>
      );

    case "transfusion":
      return (
        <SectionCard title="Antécédents de Transfusion">
          <ListSection
            disabled={disabled}
            items={form.transfusion}
            onAdd={() => addRow("transfusion", { date_transfusion: "" })}
            onRemove={(i) => removeRow("transfusion", i)}
            addLabel="Ajouter une transfusion"
            renderItem={(item, i) => (
              <Field label="Date de transfusion">
                <Input
                  disabled={disabled}
                  type="date"
                  value={item.date_transfusion}
                  onChange={(e) =>
                    updateList("transfusion", i, "date_transfusion", e.target.value)
                  }
                />
              </Field>
            )}
          />
        </SectionCard>
      );

    case "aes":
      return (
        <SectionCard title="Accidents d'Exposition au Sang (AES)">
          <ListSection
            disabled={disabled}
            items={form.aes}
            onAdd={() => addRow("aes", { date_aes: "" })}
            onRemove={(i) => removeRow("aes", i)}
            addLabel="Ajouter un AES"
            renderItem={(item, i) => (
              <Field label="Date de l'AES">
                <Input
                  disabled={disabled}
                  type="date"
                  value={item.date_aes}
                  onChange={(e) => updateList("aes", i, "date_aes", e.target.value)}
                />
              </Field>
            )}
          />
        </SectionCard>
      );

    case "gyneco":
      return (
        <SectionCard title="Antécédents Gynéco-Obstétricaux">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <Field label="Gestité">
              <Input
                disabled={disabled}
                type="number"
                value={form.gyneco.gestite}
                onChange={(e) => updateSection("gyneco", "gestite", e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="Parité">
              <Input
                disabled={disabled}
                type="number"
                value={form.gyneco.parite}
                onChange={(e) => updateSection("gyneco", "parite", e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="Avortements">
              <Input
                disabled={disabled}
                type="number"
                value={form.gyneco.avortement}
                onChange={(e) => updateSection("gyneco", "avortement", e.target.value)}
                placeholder="0"
              />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Complications">
              <Textarea
                disabled={disabled}
                value={form.gyneco.complications}
                onChange={(e) =>
                  updateSection("gyneco", "complications", e.target.value)
                }
                placeholder="Décrivez les complications…"
              />
            </Field>
            <Field label="Suivi gynécologique">
              <Textarea
                disabled={disabled}
                value={form.gyneco.suivi_gynecologique}
                onChange={(e) =>
                  updateSection("gyneco", "suivi_gynecologique", e.target.value)
                }
                placeholder="Précisez le suivi…"
              />
            </Field>
            <Field label="Dépistage cancer du col">
              <Textarea
                disabled={disabled}
                value={form.gyneco.depistage_cancer_col}
                onChange={(e) =>
                  updateSection("gyneco", "depistage_cancer_col", e.target.value)
                }
                placeholder="Résultats, dates…"
              />
            </Field>
          </div>
        </SectionCard>
      );

    case "family":
      return (
        <SectionCard title="Antécédents Familiaux">
          <BoolGrid
            fields={BOOL_FIELDS.family}
            data={form.family}
            disabled={disabled}
            onChange={(k, v) => updateSection("family", k, v)}
          />
          <div style={{ marginTop: 14 }}>
            <Field label="Autres">
              <Textarea
                disabled={disabled}
                value={form.family.autres}
                onChange={(e) => updateSection("family", "autres", e.target.value)}
                placeholder="Autres antécédents familiaux…"
              />
            </Field>
          </div>
        </SectionCard>
      );

    default:
      return null;
  }
}
