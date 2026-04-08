"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Smartphone, Sun, Moon } from "lucide-react";
import "@/styles/ui/ThemeToggle.css";

type Theme = "system" | "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") {
    root.setAttribute("data-theme", "dark");
  } else if (t === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }
}

export function ThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const icons_size = 16;

  useEffect(() => {
    if (theme !== "system") {
      applyTheme(theme);
    }
  }, []);

  const pick = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("theme", t);
    document.cookie = `theme=${t};path=/;max-age=31536000;SameSite=Strict`;
  };

  return (
    <div className="theme_toggle_container">
      <div onClick={() => pick("system")} className={`icon_btn ${theme === "system" ? "active" : ""}`}>
        <Smartphone size={icons_size} className="icon" />
      </div>
      <div onClick={() => pick("light")} className={`icon_btn ${theme === "light" ? "active" : ""}`}>
        <Sun size={icons_size} className="icon" />
      </div>
      <div onClick={() => pick("dark")} className={`icon_btn ${theme === "dark" ? "active" : ""}`}>
        <Moon size={icons_size} className="icon" />
      </div>
    </div>
  );
}