"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import AdminPanel from "../components/AdminPanel";
import Footer from "../components/Footer";

export default function AdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans selection:bg-zinc-800 selection:text-white relative overflow-x-clip ${
      isDark 
        ? "bg-[#050507] bg-gradient-to-br from-[#181524] via-[#050507] to-[#081714] text-zinc-100 grid-bg-dark" 
        : "bg-[#f8f9fc] bg-gradient-to-br from-[#f2f4ff] via-[#f8fafc] to-[#f0fdf9] text-zinc-900 grid-bg-light"
    }`}>
      {/* Ambient fixed background lights */}
      <div className={`fixed -top-16 -left-16 w-[240px] h-[240px] rounded-full blur-[80px] pointer-events-none transition-all duration-500 z-0 ${
        isDark ? "bg-purple-600/18" : "bg-purple-500/10"
      }`} />
      <div className={`fixed -bottom-16 -right-16 w-[240px] h-[240px] rounded-full blur-[80px] pointer-events-none transition-all duration-500 z-0 ${
        isDark ? "bg-emerald-500/18" : "bg-emerald-400/10"
      }`} />
      
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 md:px-8 py-10">
        <AdminPanel refreshTrigger={refreshTrigger} theme={theme} />
      </main>
      
      <Footer theme={theme} />
    </div>
  );
}
