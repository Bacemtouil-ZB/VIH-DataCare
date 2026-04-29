import {
  getMobileRendezvousService,
  getMobileRendezvousDetailService,
} from "../../services/mobile/mobileRendezvousService.js";

// GET /api/mobile/rendezvous
export const getMobileRendezvousController = async (req, res) => {
  try {
    const rendezvous = await getMobileRendezvousService(req.user.id);
    return res.status(200).json({
      success: true,
      rendezvous,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/mobile/rendezvous/:id
export const getMobileRendezvousDetailController = async (req, res) => {
  try {
    const rdv = await getMobileRendezvousDetailService(
      parseInt(req.params.id),
      req.user.id
    );
    return res.status(200).json({
      success: true,
      rendezvous: rdv,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};