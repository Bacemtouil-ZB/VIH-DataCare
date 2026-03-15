// utils/formUtils.js
export const clearFieldError = (name, setErrors) => {
  setErrors((prev) => ({
    ...prev,
    [name]: null,
  }));
};
