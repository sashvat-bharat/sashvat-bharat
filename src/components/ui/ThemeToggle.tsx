"use client";

import { useState, useEffect } from "react";
import { Smartphone, Sun, Moon } from "lucide-react";
import "@/styles/ui/ThemeToggle.css";


type Theme = "system" | "light" | "dark";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("system");
  const icons_size = 15;

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

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