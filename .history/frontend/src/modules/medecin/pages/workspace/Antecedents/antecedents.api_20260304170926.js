import antecedentsService from "../../../services/antecedentsService.jsx";

export const apiBySection = {
  medical: { put: antecedentsService.updateMedical },
  infectious: { put: antecedentsService.updateInfectious },
  therapeutic: { put: antecedentsService.updateTherapeutic },
  family: { put: antecedentsService.updateFamily },
  gyneco: { put: antecedentsService.updateGyneco },
  surgical: { put: antecedentsService.replaceSurgical },
  transfusion: { put: antecedentsService.replaceTransfusion },
  aes: { put: antecedentsService.replaceAes },
};
