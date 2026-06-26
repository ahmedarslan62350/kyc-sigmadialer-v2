"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ClipboardCheck, 
  CheckCircle, 
  ShieldCheck, 
  PhoneCall, 
  Copy, 
  Check, 
  ExternalLink,
  Lock
} from "lucide-react";
import Header from "./components/Header";
import OnboardingForm from "./components/OnboardingForm";
import Footer from "./components/Footer";

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isHovering) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovering]);
  const [submittedRecord, setSubmittedRecord] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  // Triggered when a new registration is successfully validated and posted
  const handleOnboardingSuccess = (response: any) => {
    setSubmittedRecord(response.data);
  };

  const handleResetForm = () => {
    setSubmittedRecord(null);
    setCopiedText(null);
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Helper to get realistic area code based on state selection
  const getAreaCode = (stateStr?: string) => {
    const s = (stateStr || "NY").toUpperCase().trim();
    const codes: Record<string, string> = {
      NY: "212", CA: "310", TX: "512", FL: "305", IL: "312", WA: "206", 
      MA: "617", CO: "303", GA: "404", PA: "215", MI: "313", OH: "216"
    };
    return codes[s] || "888";
  };

  const areaCode = submittedRecord ? getAreaCode(submittedRecord.state) : "888";

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans selection:bg-zinc-800 selection:text-white relative overflow-x-clip ${
      isDark 
        ? "bg-[#050507] bg-gradient-to-br from-[#181524] via-[#050507] to-[#081714] text-zinc-100 grid-bg-dark" 
        : "bg-[#f8f9fc] bg-gradient-to-br from-[#f2f4ff] via-[#f8fafc] to-[#f0fdf9] text-zinc-900 grid-bg-light"
    }`}>
      {/* Ambient fixed background lights */}
      <div className={`fixed -top-16 -left-16 w-[240px] h-[240px] rounded-full blur-[100px] pointer-events-none transition-all duration-500 z-0 ${
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

      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 md:px-8 py-10">
        <AnimatePresence mode="wait">
            <motion.div
              key="form-container"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <OnboardingForm onSuccess={handleOnboardingSuccess} theme={theme} />
            </motion.div>
        </AnimatePresence>
      </main>

      {/* Official Footprint Footer */}
      <Footer theme={theme} />
    </div>
  );
}
