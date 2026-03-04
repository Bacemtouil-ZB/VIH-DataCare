export function parseApiError(error, fallback = "Erreur") {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}
//c est un helper consider comme toast.error 