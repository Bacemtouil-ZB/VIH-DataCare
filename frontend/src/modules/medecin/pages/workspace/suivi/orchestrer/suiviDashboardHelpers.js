export const getSuiviDashboardState = (...states) => ({
  loading: states.some((state) => Boolean(state.loading)),
  error: states.map((state) => state.error).find(Boolean) || null,
});
