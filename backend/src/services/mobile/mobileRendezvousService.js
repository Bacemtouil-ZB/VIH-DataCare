import {
  getRendezvousByUserId,
  getRendezvousDetailByIdAndUserId,
} from "../../models/mobile/mobileRendezvousModel.js";

export const getMobileRendezvousService = async (userId) => {
  const rendezvous = await getRendezvousByUserId(userId);
  return rendezvous;
};

export const getMobileRendezvousDetailService = async (rdvId, userId) => {
  const rdv = await getRendezvousDetailByIdAndUserId(rdvId, userId);
  if (!rdv) throw new Error("Rendez-vous non trouvé");
  return rdv;
};