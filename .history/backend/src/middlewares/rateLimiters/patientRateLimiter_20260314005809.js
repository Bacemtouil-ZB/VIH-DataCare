// ─── Patients ─────────────────────────────────────────────────────────────────

export const createPatientLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 30,
  message: {
    success: false,
    message: "Trop de créations, réessayez dans 10 min.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const updatePatientLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Trop de modifications, réessayez dans 10 min.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const checkNumerolimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 30,
  message: {
    success: false,
    message: "Trop de vérifications, réessayez dans 1 min.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
