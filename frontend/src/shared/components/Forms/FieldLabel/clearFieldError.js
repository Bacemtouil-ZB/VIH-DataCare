// utils/formUtils.js
export const clearFieldError = (fieldName, setErrors) => {
  setErrors((prev) => ({
    ...prev,
    [fieldName]: null,
  }));
};
