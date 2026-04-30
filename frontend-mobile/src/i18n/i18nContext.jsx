import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translations, { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./translations";

const LANGUAGE_STORAGE_KEY = "app.language";

const getTranslationValue = (language, key) => {
  const source = translations[language];
  if (!source) return undefined;

  return key.split(".").reduce((value, segment) => {
    if (value && Object.prototype.hasOwnProperty.call(value, segment)) {
      return value[segment];
    }
    return undefined;
  }, source);
};

const interpolate = (template, params = {}) =>
  template.replace(/\{(\w+)\}/g, (_, token) => {
    if (Object.prototype.hasOwnProperty.call(params, token)) {
      return String(params[token]);
    }

    return `{${token}}`;
  });

export const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    let isMounted = true;

    const hydrateLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (isMounted && storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
          setLanguageState(storedLanguage);
        }
      } catch {
        // Keep default language when storage read fails.
      }
    };

    hydrateLanguage();

    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = useCallback(
    async (nextLanguage) => {
      if (!SUPPORTED_LANGUAGES.includes(nextLanguage) || nextLanguage === language) {
        return;
      }

      setLanguageState(nextLanguage);

      try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
      } catch {
        // Ignore storage write errors to avoid blocking UI updates.
      }
    },
    [language]
  );

  const t = useCallback(
    (key, params = {}) => {
      const resolveValue = (candidate) => {
        if (typeof candidate === "function") {
          return candidate(params);
        }

        if (typeof candidate === "string") {
          return interpolate(candidate, params);
        }

        return undefined;
      };

      const value = resolveValue(getTranslationValue(language, key));
      if (typeof value === "string") return value;

      const fallback = resolveValue(getTranslationValue(DEFAULT_LANGUAGE, key));
      return typeof fallback === "string" ? fallback : key;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isRTL: language === "ar",
      locale: language === "ar" ? "ar-EG" : "fr-FR",
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};
