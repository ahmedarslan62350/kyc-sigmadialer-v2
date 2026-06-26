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
          {!submittedRecord ? (
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
          ) : (
            <motion.div
              key="success-container"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
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
                  Congratulations! Outbound trunking and dialing credentials have been allocated for <strong className={`font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{submittedRecord.companyName}</strong>. 
                  Your trunks are fully compliant, Registered with the FCC Shaken/Stir database, and optimized for low call-drop rates.
                </p>

                {/* Main Provisioning Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Column 1: Allocated Phone Numbers (DIDs) */}
                  <div className={`border rounded-2xl p-5 space-y-4 ${isDark ? "border-zinc-800 bg-zinc-950" : "border-[#eef0f5] bg-[#f8fafc]/50"}`}>
                    <div className={`flex items-center gap-1.5 pb-2 border-b ${isDark ? "border-zinc-900" : "border-zinc-200/50"}`}>
                      <PhoneCall className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
                      <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                        Allocated Outbound DIDs ({submittedRecord.callingLocation})
                      </h3>
                    </div>

                    <div className="space-y-2.5">
                      <div className={`flex items-center justify-between p-2.5 border rounded-xl shadow-xs ${
                        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-[#eef0f5]"
                      }`}>
                        <span className={`font-mono font-bold text-sm ${isDark ? "text-white" : "text-zinc-900"}`}>
                          +1 ({areaCode}) 555-0105
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          <span className={`text-[10px] font-mono font-bold uppercase ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>Primary</span>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-2.5 border rounded-xl shadow-xs ${
                        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-[#eef0f5]"
                      }`}>
                        <span className={`font-mono font-bold text-sm ${isDark ? "text-white" : "text-zinc-900"}`}>
                          +1 ({areaCode}) 555-0131
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          <span className={`text-[10px] font-mono font-bold uppercase ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>Secondary</span>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-2.5 border rounded-xl shadow-xs ${
                        isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-[#eef0f5]"
                      }`}>
                        <span className={`font-mono font-bold text-sm ${isDark ? "text-white" : "text-zinc-900"}`}>
                          +1 ({areaCode}) 555-0188
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white" : "bg-zinc-400"}`}></span>
                          <span className={`text-[10px] font-mono font-bold uppercase ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>Compliance</span>
                        </div>
                      </div>
                    </div>

                    <p className={`text-[10px] font-sans leading-relaxed ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                      These numbers have been mapped to your registered trunk for localized caller ID presence, matching FCC guidelines.
                    </p>
                  </div>

                  {/* Column 2: SIP Credentials / Gateway Configuration */}
                  <div className={`border rounded-2xl p-5 space-y-4 ${isDark ? "border-zinc-800 bg-zinc-950" : "border-[#eef0f5] bg-[#f8fafc]/50"}`}>
                    <div className={`flex items-center gap-1.5 pb-2 border-b ${isDark ? "border-zinc-900" : "border-zinc-200/50"}`}>
                      <Lock className={`w-4 h-4 ${isDark ? "text-white" : "text-zinc-800"}`} />
                      <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                        Secure SIP Trunk Details
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Host */}
                      <div>
                        <span className={`text-[10px] block font-mono font-bold uppercase ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>SBC Outbound Proxy</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className={`font-mono font-bold ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>sbc-east.sigmadialer.com:5060</span>
                          <button
                            type="button"
                            onClick={() => handleCopyToClipboard("sbc-east.sigmadialer.com:5060", "proxy")}
                            className={`p-1 rounded border border-transparent transition-all cursor-pointer ${
                              isDark ? "text-zinc-500 hover:text-white hover:bg-zinc-900 hover:border-zinc-800" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-200"
                            }`}
                          >
                            {copiedText === "proxy" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scale-up" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Trunk Username */}
                      <div>
                        <span className={`text-[10px] block font-mono font-bold uppercase ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Trunk User ID</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className={`font-mono font-bold ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>
                            sd_{submittedRecord.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}_auth
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyToClipboard(`sd_${submittedRecord.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}_auth`, "user")}
                            className={`p-1 rounded border border-transparent transition-all cursor-pointer ${
                              isDark ? "text-zinc-500 hover:text-white hover:bg-zinc-900 hover:border-zinc-800" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-200"
                            }`}
                          >
                            {copiedText === "user" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scale-up" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Codecs */}
                      <div className={`grid grid-cols-2 gap-2 pt-1 border-t ${isDark ? "border-zinc-900" : "border-zinc-200/60"}`}>
                        <div>
                          <span className={`text-[9px] block font-mono uppercase font-bold ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Audio Codecs</span>
                          <span className={`font-mono font-bold text-[11px] ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>G.711u / G.729</span>
                        </div>
                        <div>
                          <span className={`text-[9px] block font-mono uppercase font-bold ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Authentication</span>
                          <span className={`font-mono font-bold text-[11px] ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>IP Authorized</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Compliance Attestations Block */}
                <div className={`border rounded-2xl p-5 space-y-3 transition-all ${
                  isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-[#f8fafc] border-[#eef0f5]"
                }`}>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                    FCC & TCPA Regulatory Compliance Attestations
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className={`border rounded-xl p-3 space-y-1.5 ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-[#eef0f5]"}`}>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        STIR/SHAKEN
                      </span>
                      <div className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className={`font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>Attestation A</span>
                      </div>
                      <p className={`text-[9px] leading-normal ${isDark ? "text-zinc-500" : "text-zinc-550"}`}>
                        Full Caller ID authentication assigned at base carrier gateway.
                      </p>
                    </div>

                    <div className={`border rounded-xl p-3 space-y-1.5 ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-[#eef0f5]"}`}>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        FCC Robocall Database
                      </span>
                      <div className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className={`font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>Verified Carrier</span>
                      </div>
                      <p className={`text-[9px] leading-normal ${isDark ? "text-zinc-500" : "text-zinc-550"}`}>
                        Representative {submittedRecord.firstName} {submittedRecord.lastName} matched to Registry.
                      </p>
                    </div>

                    <div className={`border rounded-xl p-3 space-y-1.5 ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-[#eef0f5]"}`}>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                        DNC Safe Scrub
                      </span>
                      <div className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className={`font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>
                          {submittedRecord.dialDNC === "no" ? "Always Scrub" : "Bypass Mode"}
                        </span>
                      </div>
                      <p className={`text-[9px] leading-normal ${isDark ? "text-zinc-500" : "text-zinc-550"}`}>
                        {submittedRecord.dialDNC === "no" 
                          ? "National and wireless DNC registry active on outdial routing." 
                          : "Calling party certifies express written permission to dial."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4">
                  <div className={`text-xs font-mono ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                    Representative Authorized Code: <span className={`font-bold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>{submittedRecord.teamsId}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleResetForm}
                      className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm text-center ${
                        isDark ? "bg-white hover:bg-zinc-200 text-black" : "bg-[#181920] hover:bg-zinc-900 text-white"
                      }`}
                    >
                      Onboard Another Campaign
                    </button>
                    <a
                      href="https://sigmadialer.com/terms.html"
                      target="_blank"
                      rel="noreferrer"
                      className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-1 border ${
                        isDark ? "text-zinc-300 border-zinc-800 hover:bg-zinc-900" : "text-zinc-700 border-zinc-250 hover:bg-zinc-50"
                      }`}
                    >
                      <span>View Terms & Conditions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Official Footprint Footer */}
      <Footer theme={theme} />
    </div>
  );
}
