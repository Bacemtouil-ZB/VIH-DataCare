export const computeExpiresAt = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
};

export const formatExpiration = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day:   "2-digit",
    month: "long",
    year:  "numeric",
  });
};

export const isExpired = (dateStr) => {
  if (!dateStr) return true;
  return new Date(dateStr) < new Date();
};