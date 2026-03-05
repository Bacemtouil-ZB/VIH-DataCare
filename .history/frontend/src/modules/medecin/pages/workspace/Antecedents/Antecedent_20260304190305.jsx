import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./antecedents_style.css";

import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

import antecedentsService from "../../../services/antecedentsService.jsx";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
import { sanitizeForApi, getErrorMessage } from "./helpers.js";

const apiBySection = {
  medical: { put: antecedentsService.updateMedical },
  infectious: { put: antecedentsService.updateInfectious },
  therapeutic: { put: antecedentsService.updateTherapeutic },
  family: { put: antecedentsService.updateFamily },
  gyneco: { put: antecedentsService.updateGyneco },
  surgical: { put: antecedentsService.replaceSurgical },
  transfusion: { put: antecedentsService.replaceTransfusion },
  aes: { put: antecedentsService.replaceAes },
};

const PAGE_MODE = {
  IDLE: "idle",
  CREATING: "creating",
  EDITING: "editing",
  SAVING: "saving",
};

export default function AntecedentsForm() {
  const { numero } = useParams();

  const [active, setActive] = useState("medical");
  const [form, setForm] = useState(initialState);
  const [pageMode, setPageMode] = useState(PAGE_MODE.IDLE);

  // optional metadata for future history/version UI
  const [activeVersion, setActiveVersion] = useState(null);

  const savedRef = useRef(initialState);
  const dirtyRef = useRef(new Set());
  const [, forceRender] = useState(0);

  const isBusy = pageMode === PAGE_MODE.CREATING || pageMode === PAGE_MODE.SAVING;
  const isEditable = pageMode === PAGE_MODE.EDITING;
  const dirtyCount = dirtyRef.current.size;

  const resetDirty = () => {
    dirtyRef.current = new Set();
    forceRender((x) => x + 1);
  };

  const markDirty = (sectionId) => {
    if (!dirtyRef.current.has(sectionId)) {
      dirtyRef.current.add(sectionId);
      forceRender((x) => x + 1);
    }
  };

  const patchSection = (sectionId, producer) => {
    if (!isEditable) return;
    setForm((prev) => {
      const nextSection = producer(prev[sectionId]);
      markDirty(sectionId);
      return { ...prev, [sectionId]: nextSection };
    });
  };

  const updateSection = (sectionId, key, value) =>
    patchSection(sectionId, (cur) => ({ ...(cur || {}), [key]: value }));

  const updateList = (sectionId, index, key, value) =>
    patchSection(sectionId, (cur) => {
      const arr = Array.isArray(cur) ? [...cur] : [];
      arr[index] = { ...(arr[index] || {}), [key]: value };
      return arr;
    });

  const addRow = (sectionId, template) =>
    patchSection(sectionId, (cur) => [...(Array.isArray(cur) ? cur : []), { ...template }]);

  const removeRow = (sectionId, index) =>
    patchSection(sectionId, (cur) =>
      Array.isArray(cur) ? cur.filter((_, i) => i !== index) : [],
    );

  const handleCreateNewAntecedent = useCallback(async () => {
    if (!numero || isBusy) return;

    const ok = await confirmAction({
      title: "Create new antecedent?",
      text: "This will open a new editable antecedent form.",
      confirmButtonText: "Create",
    });
    if (!ok) return;

    setPageMode(PAGE_MODE.CREATING);

    try {
      const created = await antecedentsService.postNewAntecedentVersion(numero);
      const versionNumber = created?.antecedent?.version_number ?? null;
      setActiveVersion(versionNumber);

      const fresh = { ...initialState };
      setForm(fresh);
      savedRef.current = fresh;
      resetDirty();

      setPageMode(PAGE_MODE.EDITING);
      toast.success("Antecedent created. You can now fill the form.");
    } catch (e) {
      setPageMode(PAGE_MODE.IDLE);
      toast.error(getErrorMessage(e));
    }
  }, [numero, isBusy]);

  const handleCancel = () => {
    setForm(savedRef.current);
    resetDirty();
    setPageMode(PAGE_MODE.IDLE);
    toast.info("Changes canceled");
  };

  const handleSaveAntecedent = useCallback(async () => {
    if (!numero) return;
    if (!isEditable) return toast.info("Create a new antecedent first.");
    if (dirtyRef.current.size === 0) return toast.info("No changes to save.");

    const ok = await confirmAction({
      title: "Save antecedent?",
      text: `You are about to save ${dirtyRef.current.size} section(s).`,
      confirmButtonText: "Save",
    });
    if (!ok) return;

    setPageMode(PAGE_MODE.SAVING);

    try {
      for (const sectionId of dirtyRef.current) {
        const api = apiBySection[sectionId];
        if (!api?.put) continue;
        await api.put(numero, sanitizeForApi(sectionId, form[sectionId]));
      }

      savedRef.current = form;
      resetDirty();
      setPageMode(PAGE_MODE.IDLE);

      toast.success("Antecedent saved successfully.");
    } catch (e) {
      setPageMode(PAGE_MODE.EDITING);
      toast.error(getErrorMessage(e));
    }
  }, [numero, isEditable, form]);

  return (
    <div className="antecedents-page">
      <header className="antecedents-header">
        <div className="antecedents-header__left">
          <h1 className="antecedents-title">Antecedents</h1>
          {activeVersion ? (
            <p className="antecedents-subtitle">Active version: v{activeVersion}</p>
          ) : (
            <p className="antecedents-subtitle">No antecedent created yet</p>
          )}
        </div>

        <div className="antecedents-header__actions">
          {pageMode === PAGE_MODE.IDLE && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleCreateNewAntecedent}
              disabled={isBusy}
            >
              Create New Antecedent
            </button>
          )}

          {isEditable && (
            <>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleSaveAntecedent}
                disabled={isBusy}
              >
                {pageMode === PAGE_MODE.SAVING ? "Saving..." : "Save Antecedent"}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={handleCancel}
                disabled={isBusy}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </header>

      {pageMode === PAGE_MODE.IDLE ? (
        <section className="empty-state">
          <h2 className="empty-state__title">Start a new antecedent</h2>
          <p className="empty-state__text">
            No data is shown by default. Click <strong>Create New Antecedent</strong> to begin.
          </p>
        </section>
      ) : (
        <main className="antecedents-content">
          <div className="antecedents-meta">
            {dirtyCount > 0 ? <span className="chip chip--info">{dirtyCount} modified section(s)</span> : null}
            <span className="chip chip--neutral">Editing enabled</span>
          </div>

          <TabNavigation sections={SECTIONS} active={active} onChange={setActive} />

          <SectionRenderer
            active={active}
            form={form}
            BOOL_FIELDS={BOOL_FIELDS}
            updateSection={updateSection}
            updateList={updateList}
            addRow={addRow}
            removeRow={removeRow}
            readOnly={!isEditable}
          />
        </main>
      )}
    </div>
  );
}