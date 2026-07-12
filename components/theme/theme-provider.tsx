"use client";

import React from "react";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "qwetu-pos-theme";
const THEME_CHANGE_EVENT = "qwetu-pos-theme-change";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY);

  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
}

function subscribeToThemeChange(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

function getServerTheme(): ThemeMode {
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(subscribeToThemeChange, getStoredTheme, getServerTheme);

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    const currentTheme = getStoredTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
