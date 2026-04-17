import { useResultatsBiologiquesLogic } from "./useResultatsBiologiquesLogic";
import ResultatsBiologiquesUI            from "./ResultatsBiologiquesUI";
import "./Resultatsbiologiques.css";

export default function ResultatsBiologiques() {
  const logic = useResultatsBiologiquesLogic();

  return (
    <ResultatsBiologiquesUI
      bilans={logic.bilans}
      champsActifs={logic.champsActifs}
      bilanActif={logic.bilanActif}
      loading={logic.loading}
      saving={logic.saving}
      showForm={logic.showForm}
      showHistory={logic.showHistory}
      setShowHistory={logic.setShowHistory}
      isModifying={logic.isModifying}
      detailItem={logic.detailItem}
      setDetailItem={logic.setDetailItem}
      formData={logic.formData}
      field={logic.field}
      errors={logic.errors}
      setErrors={logic.setErrors}
      getResultatForBilan={logic.getResultatForBilan}
      openCreateForBilan={logic.openCreateForBilan}
      openEdit={logic.openEdit}
      closeForm={logic.closeForm}
      handleShowDetails={logic.handleShowDetails}
      handleSubmit={logic.handleSubmit}
      nfSections={logic.nfSections}
      toggleSectionNF={logic.toggleSectionNF}
      fileInputRef={logic.fileInputRef}
      genotypageSectionRef={logic.genotypageSectionRef}
      openGenotypagePage={logic.openGenotypagePage}
      openGenotypagePicker={logic.openGenotypagePicker}
      handleGenotypageFileChange={logic.handleGenotypageFileChange}
    />
  );
}