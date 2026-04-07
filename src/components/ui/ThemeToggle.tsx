"use client";

import { useState, useEffect } from "react";
import { Smartphone, Sun, Moon } from "lucide-react";
import "@/styles/ui/ThemeToggle.css";


type Theme = "system" | "light" | "dark";

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") {
    root.setAttribute("data-theme", "dark");
  } else if (t === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    // system — follow OS preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }
}

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("system");
  const icons_size = 16;

  // Load saved theme on mount and apply it
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved && saved !== "system") {
      setTheme(saved);
      applyTheme(saved);
    }

    // Listen for OS preference changes when in "system" mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Re-apply whenever theme selection changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const pick = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("theme", t);
  };

  return (
    <>

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
    </>
  );
};

export default ThemeToggle;