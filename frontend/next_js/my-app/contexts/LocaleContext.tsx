"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import ru from "../locales/ru.json";
import en from "../locales/en.json";

type Messages = Record<string, any>;

const MESSAGES: Record<string, Messages> = {
  ru,
  en,
};

type LocaleContextValue = {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string, fallback?: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

// Helper to get initial locale from localStorage or defaults to 'ru'
const getInitialLocale = (): string => {
  try {
    const saved = localStorage.getItem("locale");
    if (saved && (saved === "ru" || saved === "en")) {
      return saved;
    }
  } catch (e) {
    // ignore localStorage access errors
  }
  return "ru";
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use a function to initialize state from localStorage on client mount
  const [localeState, setLocaleState] = useState<string>("ru");
  const [isHydrated, setIsHydrated] = useState(false);

  // After hydration, sync with localStorage
  useEffect(() => {
    const initialLocale = getInitialLocale();
    if (initialLocale !== localeState) {
      setLocaleState(initialLocale);
    }
    setIsHydrated(true);
  }, []);

  const setLocale = (l: string) => {
    setLocaleState(l);
    try {
      localStorage.setItem("locale", l);
    } catch (e) {
      // ignore
    }
  };

  const messages = useMemo(() => MESSAGES[localeState as "ru" | "en"] || MESSAGES.ru, [localeState]);

  const t = (key: string, fallback?: string) => {
    const parts = key.split(".");
    let cur: any = messages;
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return fallback || key;
      }
    }
    return typeof cur === "string" ? cur : fallback || key;
  };

  return (
    <LocaleContext.Provider value={{ locale: localeState, setLocale, t }}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
};
