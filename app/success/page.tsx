"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Check, 
  ExternalLink
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SuccessPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [submittedRecord, setSubmittedRecord] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovering, setIsHovering] = useState(false);

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

  // Get submitted record from localStorage
  useEffect(() => {
    const savedRecord = localStorage.getItem("submittedRecord");
    if (savedRecord) {
      setSubmittedRecord(JSON.parse(savedRecord));
    }
  }, []);

  // Mouse follower effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!submittedRecord) {
    return (
      <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans selection:bg-zinc-800 selection:text-white relative overflow-x-clip ${
        isDark 
          ? "bg-[#050507] bg-gradient-to-br from-[#181524] via-[#050507] to-[#081714] text-zinc-100 grid-bg-dark" 
          : "bg-[#f8f9fc] bg-gradient-to-br from-[#f2f4ff] via-[#f8fafc] to-[#f0fdf9] text-zinc-900 grid-bg-light"
      }`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 md:px-8 py-10 flex items-center justify-center">
          <div className={`text-center ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            No submission record found. Please complete the onboarding form first.
          </div>
        </main>
        <Footer theme={theme} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans selection:bg-zinc-800 selection:text-white relative overflow-x-clip ${
      isDark 
        ? "bg-[#050507] bg-gradient-to-br from-[#181524] via-[#050507] to-[#081714] text-zinc-100 grid-bg-dark" 
        : "bg-[#f8f9fc] bg-gradient-to-br from-[#f2f4ff] via-[#f8fafc] to-[#f0fdf9] text-zinc-900 grid-bg-light"
    }`}>
      {/* Ambient fixed background lights */}
      <div className={`fixed -top-16 -left-16 w-[240px] h-[240px] rounded-full blur-[80px] pointer-events-none transition-all duration-500 z-0 ${
        isDark ? "bg-purple-600/20" : "bg-purple-500/10"
      }`} />
      <div className={`fixed -bottom-16 -right-16 w-[240px] h-[240px] rounded-full blur-[100px] pointer-events-none transition-all duration-500 z-0 ${
        isDark ? "bg-emerald-500/20" : "bg-emerald-400/10"
      }`} />

      {/* Dynamic Cursor Light Follower */}
      {isHovering && (
        <div 
          className="fixed pointer-events-none w-[220px] h-[220px] rounded-full blur-[70px] z-0 transition-transform duration-300 ease-out"
          style={{
            left: `${mousePos.x - 110}px`,
            top: `${mousePos.y - 110}px`,
            backgroundColor: isDark ? "rgba(168, 85, 247, 0.12)" : "rgba(168, 85, 247, 0.06)",
          }}
        />
      )}

      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 md:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto py-4"
        >
          <div className={`rounded-3xl p-6 md:p-8 shadow-2xl space-y-8 relative overflow-hidden text-left border transition-all duration-300 ${
            isDark ? "bg-[#0b0c10]/70 border-zinc-800" : "bg-white border-[#eef0f5]"
          }`}>
            {/* Brand Line */}
            <div className={`absolute top-0 inset-x-0 h-1.5 ${isDark ? "bg-white" : "bg-[#181920]"}`}></div>
            
            {/* Approval Header */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b ${
              isDark ? "border-zinc-900" : "border-zinc-100"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 border rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${
                  isDark ? "bg-emerald-950/30 border-emerald-900 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"
                }`}>
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isDark ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                    }`}>
                      Application Approved
                    </span>
                    <span className={`text-[10px] font-mono font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isDark ? "bg-zinc-900 text-zinc-300 border-zinc-800" : "bg-zinc-100 text-zinc-600 border-zinc-200"
                    }`}>
                      Trunks Active
                    </span>
                  </div>
                  <h2 className={`text-xl md:text-2xl font-extrabold font-sans tracking-tight mt-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    Outbound SIP Channels Provisioned
                  </h2>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[11px] font-mono block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Sync Identifier</span>
                <span className={`font-mono font-bold text-xs border px-2 py-1 rounded ${
                  isDark ? "text-zinc-300 bg-zinc-900 border-zinc-850" : "text-zinc-700 bg-zinc-100 border-zinc-200"
                }`}>Ref: {submittedRecord._id}</span>
              </div>
            </div>

            <p className={`text-xs md:text-sm leading-relaxed font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Thank you for your submission! Your application has been received successfully. Our team will review your information and get back to you shortly.
            </p>

            {/* Success Icon */}
            <div className="flex justify-center py-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                isDark ? "bg-emerald-950/30 border-emerald-900" : "bg-emerald-50 border-emerald-200"
              }`}>
                <Check className={`w-12 h-12 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
              </div>
            </div>

            {/* Footer Actions */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t ${
              isDark ? "border-zinc-900" : "border-zinc-100"
            }`}>
              <div className={`text-[10px] font-sans ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                <span className="font-bold">Need help?</span> Contact support at <a href="mailto:support@sigmadialer.com" className={`underline ${isDark ? "hover:text-white" : "hover:text-zinc-900"}`}>support@sigmadialer.com</a>
              </div>
              <a
                href="/"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isDark 
                    ? "bg-white text-black hover:bg-zinc-200" 
                    : "bg-[#181920] text-white hover:bg-zinc-800"
                }`}
              >
                Return Home
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
