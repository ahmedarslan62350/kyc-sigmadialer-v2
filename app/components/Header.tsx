"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const isDark = theme === "dark";

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center select-none transition-all duration-300 pt-3 pb-2 px-4 bg-transparent">
      {/* Floating Pill-shaped glassmorphic navbar matching reference screenshot */}
      <header className={`w-full max-w-5xl backdrop-blur-xl border rounded-xl py-2.5 px-6 md:px-8 flex justify-between items-center transition-all duration-300 shadow-2xl ${isDark
          ? "bg-[#0b0c10]/75 border-zinc-800/80 shadow-zinc-950/40"
          : "bg-white/75 border-zinc-200/70 shadow-zinc-200/20"
        }`}>
        {/* Brand Logo Wordmark */}
        <a href="https://sigmadialer.com" className="flex items-center cursor-pointer animate-fade-in">
          <span className={`font-sans font-extrabold text-sm md:text-base tracking-tight flex items-center gap-1.5 transition-colors ${isDark ? "text-white" : "text-zinc-900"}`}>
            Sigma Dialer
          </span>
        </a>

        {/* Navigation Links (Matches screenshot items: Platform, Architecture, Intelligence, Security, Compare, FAQ, Terms) */}
        <nav className={`hidden md:flex items-center space-x-5 lg:space-x-7 text-xs lg:text-[13px] font-medium transition-colors ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
          <a href="https://sigmadialer.com/#platform" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Platform</a>
          <a href="https://sigmadialer.com/#architecture" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Architecture</a>
          <a href="https://sigmadialer.com/#intelligence" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Intelligence</a>
          <a href="https://sigmadialer.com/#security" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Security</a>
          <a href="https://sigmadialer.com/#compare" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>Compare</a>
          <a href="https://sigmadialer.com/#faq" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>FAQ</a>
          <a
            href="https://sigmadialer.com/terms.html"
            target="_blank"
            rel="noreferrer"
            className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}
          >
            Terms
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-[8px] border transition-all cursor-pointer flex items-center justify-center ${isDark
                ? "text-zinc-400 hover:text-white hover:bg-zinc-900/60 border-zinc-800 bg-zinc-950/20"
                : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 border-zinc-200 bg-white/20"
              }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-white animate-pulse" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-black" />
            )}
          </button>

          {/* Sign In Button (switches to Admin Panel) */}
          <a
            href="https://login.sigmadialer.com/"
            className={`text-xs font-semibold px-4 py-2 rounded-[12px] border transition-all shadow-xs cursor-pointer ${isDark
                ? "text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white bg-transparent"
                : "text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 bg-transparent"
              }`}
          >
            Sign In
          </a>
        </div>
      </header>
    </div>
  );
}
