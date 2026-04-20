import { buildNotifications ,getDateEstimeeByNumero } from "../services/suiviNotificationService.js";

export const getNotificationsController = async (_req, res) => {
  try {
    const notifications = await buildNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erreur getNotifications:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getDateEstimee = async (req, res) => {
  try {
    const { numero } = req.params;
    const data = await getDateEstimeeByNumero(numero);

    if (!data) {
      return res.status(404).json({ message: "Aucune date estimée trouvée" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur getDateEstimee:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};