export const getVihValidationError = (formData, requiredFields) => {
  for (const field of requiredFields) {
    const value = formData[field.key];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return `${field.label} est obligatoire`;
    }
  }
  return null;
};
