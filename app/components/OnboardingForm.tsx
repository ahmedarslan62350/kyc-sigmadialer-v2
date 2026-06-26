"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Users, Phone, MapPin, Briefcase, 
  Settings, CheckSquare, Sparkles, Send, ShieldCheck, 
  HelpCircle, AlertCircle, Loader2, RefreshCw,
  Clock, Globe
} from "lucide-react";
import { registrationSchema, RegistrationInput } from "@/lib/validation";

interface OnboardingFormProps {
  onSuccess: (savedRecord: any) => void;
  theme: "light" | "dark";
}

export default function OnboardingForm({ onSuccess, theme }: OnboardingFormProps) {
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);
  const [ipStatus, setIpStatus] = useState<"loading" | "detected" | "failed">("loading");
  const [detectedIpInfo, setDetectedIpInfo] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Initialize React Hook Form
  const { register, handleSubmit, setValue, watch, formState: { errors: formErrors } } = useForm<RegistrationInput>({
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      companyRegistrationNo: "",
      contactNumber: "",
      role: "",
      callingLocation: "USA",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      teamsId: "",
      numberOfAgents: 1,
      typeOfAgents: "Voice",
      campaign: "",
      dialDNC: "no",
      additionalInfo: "",
      termsAccepted: false,
    }
  });

  // Watch key fields for conditional UI state
  const typeOfAgents = watch("typeOfAgents");
  const dialDNC = watch("dialDNC");
  const callingLocation = watch("callingLocation");

  // Real-time IP Geo-Location auto-detection
  useEffect(() => {
    async function autoDetectGeoIP() {
      setIpStatus("loading");
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          setDetectedIpInfo(data);
          setIpStatus("detected");

          // Pre-populate fields safely
          if (data.country_name) setValue("country", data.country_name);
          if (data.city) setValue("city", data.city);
          if (data.region) setValue("state", data.region);
          if (data.postal) setValue("zipCode", data.postal);
          
          // Pre-populate dial prefix inside phone
          if (data.country_calling_code) {
            setValue("contactNumber", `${data.country_calling_code} `);
          }

          // Auto select calling region
          if (data.country_code === "CA") {
            setValue("callingLocation", "Canada");
          } else {
            setValue("callingLocation", "USA");
          }
        } else {
          throw new Error("GeoIP payload not OK");
        }
      } catch (err) {
        console.warn("GeoIP lookup failed. Defaulting to standard region US:", err);
        setIpStatus("failed");
        // Fallbacks
        setValue("country", "United States");
        setValue("callingLocation", "USA");
        setValue("contactNumber", "+1 ");
      }
    }

    autoDetectGeoIP();
  }, [setValue]);

  // Handle Form Submission
  const onSubmitForm = async (data: RegistrationInput) => {
    setLoading(true);
    setServerError(null);
    setValidationErrors({});

    // 1. Zod Validation Check on Frontend
    const validation = registrationSchema.safeParse(data);
    if (!validation.success) {
      const flattened = validation.error.flatten().fieldErrors;
      const clientErrors: Record<string, string> = {};
      for (const key in flattened) {
        clientErrors[key] = flattened[key as keyof typeof flattened]?.[0] || "Invalid field value";
      }
      setValidationErrors(clientErrors);
      setLoading(false);

      // Scroll to first error element
      const firstErrKey = Object.keys(clientErrors)[0];
      const element = document.getElementsByName(firstErrKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // 2. Submit API Request to Next.js Backend
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.errors) {
          // Map backend schema errors
          const mappedErrors: Record<string, string> = {};
          for (const key in result.errors) {
            mappedErrors[key] = Array.isArray(result.errors[key]) 
              ? result.errors[key][0] 
              : result.errors[key];
          }
          setValidationErrors(mappedErrors);
          throw new Error("Validation check failed on server. Please check highlighted fields.");
        } else {
          throw new Error(result.error || result.details || "Failed to submit registration");
        }
      }
      if (result.verification && result.verification.verification_url) {
        window.location.href = result.verification.verification_url;
      } else {
        window.location.href = "/success";
      }
    } catch (err: any) {
      console.error("Form transmission failure:", err);
      setServerError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmitForm)} 
      className="max-w-5xl mx-auto pb-16"
      noValidate
    >
      <div className="grid grid-cols-1 gap-8 items-start">
        
        {/* LEFT COLUMN: Talk to the Team layout from reference images */}
        <div className="space-y-6 self-start select-none">
          {/* Pill Tag */}
          <div>
            <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider font-sans shadow-sm transition-all duration-300 ${
              isDark 
                ? "bg-zinc-950/40 border-zinc-800 text-zinc-300" 
                : "bg-white/90 border-zinc-200/80 text-zinc-700"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Talk to the team</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className={`text-4xl lg:text-5xl font-sans font-black tracking-tight leading-tight transition-colors ${
            isDark ? "text-white" : "text-[#111218]"
          }`}>
            Let's map this to <span className="font-serif italic font-medium text-indigo-500">your</span> floor.
          </h1>

          {/* Body description */}
          <p className={`text-sm md:text-base font-sans font-normal leading-relaxed transition-colors ${
            isDark ? "text-zinc-400" : "text-[#4a4c5a]"
          }`}>
            A 30-minute call with a real solutions engineer — no sales BDR gatekeeper, no calendar tennis. Bring your use case; we'll come with a reference architecture, compliance footprint, and an honest answer on fit.
          </p>

          {/* Operational Status Pill */}
          <div className="pt-2">
            <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[11px] font-bold font-mono tracking-wider transition-all duration-300 ${
              isDark 
                ? "bg-zinc-900/40 border-zinc-800/80 text-zinc-400" 
                : "bg-emerald-50/50 border-emerald-100 text-emerald-800"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All systems operational · p50 38 ms · 12,482 agents online</span>
            </div>
          </div>
        </div>


        {/* RIGHT COLUMN: Sequential Form Cards matching the Get in Touch card design */}
        <div className=" space-y-6">
          
          {/* IP Auto Selection Banner */}
          <div className={`border rounded-xl p-4 flex items-center justify-between shadow-xs transition-all duration-300 ${
            isDark ? "bg-[#0b0c10]/40 border-zinc-800/80 text-white" : "bg-white/70 border-[#eef0f5] text-zinc-900"
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isDark ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-800"}`}>
                <RefreshCw className={`w-4 h-4 ${ipStatus === "loading" ? "animate-spin" : ""}`} />
              </div>
              <div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>IP Location Engine</span>
                <p className={`text-xs font-sans mt-0.5 transition-colors ${isDark ? "text-zinc-400" : "text-[#4a4c5a]"}`}>
                  {ipStatus === "loading" && "Detecting your outbound dialing prefix and country..."}
                  {ipStatus === "detected" && `Detected IP near ${detectedIpInfo?.city || "unknown"}, ${detectedIpInfo?.country_name}. Default dial-prefix configured to ${detectedIpInfo?.country_calling_code || "+1"}`}
                  {ipStatus === "failed" && "Location lookup timed out. Defaulted dialing origin to US (+1)."}
                </p>
              </div>
            </div>
            {ipStatus === "detected" && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border font-mono tracking-wide ${
                isDark 
                  ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/60" 
                  : "bg-[#e6faf3] text-[#00c98c] border-[#ccf5e7]"
              }`}>
                {detectedIpInfo?.ip || "AUTO-IP"}
              </span>
            )}
          </div>

          {serverError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 border rounded-xl flex items-start space-x-3 text-sm ${
                isDark 
                  ? "bg-rose-950/20 border-rose-900 text-rose-400" 
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">Submission Refused</span>
                <p className="mt-1">{serverError}</p>
              </div>
            </motion.div>
          )}

          {/* Section A: Contact Representative */}
          <div className={`border rounded-2xl p-6 shadow-xs space-y-4 transition-all duration-300 ${
            isDark ? "bg-[#0b0c10]/70 border-zinc-800/80" : "bg-white border-[#eef0f5]"
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isDark ? "border-zinc-900" : "border-zinc-100"}`}>
              <div className="flex items-center space-x-2">
                <Briefcase className={`w-4 h-4 ${isDark ? "text-white" : "text-zinc-800"}`} />
                <h3 className={`font-sans font-bold text-sm tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Get in touch
                </h3>
              </div>
              <span className={`text-[9px] font-mono font-semibold tracking-wider ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                TYPICALLY &lt; 4 HOURS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>First Name</label>
                <input
                  {...register("firstName")}
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Jane"
                  className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all ${
                    isDark 
                      ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.firstName ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                      : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.firstName ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                  }`}
                />
                {validationErrors.firstName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>Last Name</label>
                <input
                  {...register("lastName")}
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all ${
                    isDark 
                      ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.lastName ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                      : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.lastName ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                  }`}
                />
                {validationErrors.lastName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="role" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}>Your Role in Business</label>
              <input
                {...register("role")}
                type="text"
                id="role"
                name="role"
                placeholder="e.g. Operations Director, VP Outbound Sales"
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all ${
                  isDark 
                    ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.role ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                    : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.role ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                }`}
              />
              {validationErrors.role && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.role}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contactNumber" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}>Contact Number</label>
              <div className="relative">
                <input
                  {...register("contactNumber")}
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="+1 555-0199"
                  className={`w-full text-sm rounded-xl pl-10 pr-3.5 py-2.5 outline-none font-sans transition-all ${
                    isDark 
                      ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.contactNumber ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                      : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.contactNumber ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                  }`}
                />
                <Phone className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${isDark ? "text-zinc-500" : "text-zinc-400"}`} />
              </div>
              {validationErrors.contactNumber && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.contactNumber}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="teamsId" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}>Teams ID</label>
              <input
                {...register("teamsId")}
                type="text"
                id="teamsId"
                name="teamsId"
                placeholder="e.g. jane@acme.com or Sales-East"
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all ${
                  isDark 
                    ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.teamsId ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                    : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.teamsId ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                }`}
              />
              <p className={`text-[10px] mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Unique workspace or company group identification ID.</p>
              {validationErrors.teamsId && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.teamsId}
                </p>
              )}
            </div>
          </div>


          {/* Section B: Business Profile & Agent Configuration */}
          <div className={`border rounded-2xl p-6 shadow-xs space-y-4 transition-all duration-300 ${
            isDark ? "bg-[#0b0c10]/70 border-zinc-800/80" : "bg-white border-[#eef0f5]"
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isDark ? "border-zinc-900" : "border-zinc-100"}`}>
              <div className="flex items-center space-x-2">
                <Building2 className={`w-4 h-4 ${isDark ? "text-white" : "text-zinc-800"}`} />
                <h3 className={`font-sans font-bold text-sm tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Business Profile
                </h3>
              </div>
              <span className={`text-[9px] font-mono font-semibold tracking-wider ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                SIGMA DIALER TRUNKS
              </span>
            </div>

            <div>
              <label htmlFor="companyName" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}>Company Name</label>
              <input
                {...register("companyName")}
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Acme Contact Center"
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all ${
                  isDark 
                    ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.companyName ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                    : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.companyName ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                }`}
              />
              {validationErrors.companyName && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.companyName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="companyRegistrationNo" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}>
                Company Registration No <span className={`font-normal ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>(Optional)</span>
              </label>
              <input
                {...register("companyRegistrationNo")}
                type="text"
                id="companyRegistrationNo"
                name="companyRegistrationNo"
                placeholder="e.g. US-898239-BC"
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all ${
                  isDark 
                    ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.companyRegistrationNo ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                    : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.companyRegistrationNo ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                }`}
              />
              {validationErrors.companyRegistrationNo && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.companyRegistrationNo}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="numberOfAgents" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>Team Size</label>
                <div className="relative">
                  <input
                    {...register("numberOfAgents")}
                    type="number"
                    id="numberOfAgents"
                    name="numberOfAgents"
                    min="1"
                    max="10000"
                    className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all ${
                      isDark 
                        ? `border bg-[#0e0f14] text-white focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.numberOfAgents ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                        : `border bg-[#f1f3f5] text-zinc-900 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.numberOfAgents ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                    }`}
                  />
                </div>
                {validationErrors.numberOfAgents && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.numberOfAgents}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>Type of Agents</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("typeOfAgents", "Voice")}
                    className={`text-xs py-2.5 font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      typeOfAgents === "Voice"
                        ? (isDark ? "bg-white text-black border-white shadow-md" : "bg-[#181920] text-white border-[#181920] shadow-sm")
                        : (isDark ? "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white" : "bg-[#f1f3f5] text-zinc-600 border-transparent hover:bg-zinc-200")
                    }`}
                  >
                    Voice
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("typeOfAgents", "Bots")}
                    className={`text-xs py-2.5 font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      typeOfAgents === "Bots"
                        ? (isDark ? "bg-white text-black border-white shadow-md" : "bg-[#181920] text-white border-[#181920] shadow-sm")
                        : (isDark ? "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white" : "bg-[#f1f3f5] text-zinc-600 border-transparent hover:bg-zinc-200")
                    }`}
                  >
                    AI Bots
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="campaign" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}>What are you trying to solve?</label>
              <input
                {...register("campaign")}
                type="text"
                id="campaign"
                name="campaign"
                placeholder="We're moving off [legacy] and need predictive dialing..."
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all ${
                  isDark 
                    ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.campaign ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                    : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.campaign ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                }`}
              />
              {validationErrors.campaign && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.campaign}
                </p>
              )}
            </div>
          </div>


          {/* Section C: Region & Address */}
          <div className={`border rounded-2xl p-6 shadow-xs space-y-6 transition-all duration-300 ${
            isDark ? "bg-[#0b0c10]/70 border-zinc-800/80" : "bg-white border-[#eef0f5]"
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isDark ? "border-zinc-900" : "border-zinc-100"}`}>
              <div className="flex items-center space-x-2">
                <MapPin className={`w-4 h-4 ${isDark ? "text-white" : "text-zinc-800"}`} />
                <h3 className={`font-sans font-bold text-sm tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Geographic & Compliance Routing
                </h3>
              </div>
              <span className={`text-[9px] font-mono font-semibold tracking-wider ${isDark ? "text-teal-400" : "text-teal-600"}`}>
                COMPLIANCE ROUTING
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Where are you calling from? */}
              <div className="space-y-2">
                <label className={`block text-[10px] font-bold font-mono tracking-wider uppercase ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  Where are you calling?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("callingLocation", "USA")}
                    className={`p-3 font-semibold rounded-xl border text-sm flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      callingLocation === "USA"
                        ? (isDark ? "bg-white text-black border-white shadow-md" : "bg-[#181920] text-white border-[#181920] shadow-sm")
                        : (isDark ? "bg-[#0e0f14] text-zinc-400 border-zinc-800 hover:text-white" : "bg-[#f1f3f5] text-zinc-600 border-transparent hover:bg-zinc-200")
                    }`}
                  >
                    <span className="text-base">🇺🇸</span>
                    <span className="text-xs">USA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("callingLocation", "Canada")}
                    className={`p-3 font-semibold rounded-xl border text-sm flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      callingLocation === "Canada"
                        ? (isDark ? "bg-white text-black border-white shadow-md" : "bg-[#181920] text-white border-[#181920] shadow-sm")
                        : (isDark ? "bg-[#0e0f14] text-zinc-400 border-zinc-800 hover:text-white" : "bg-[#f1f3f5] text-zinc-600 border-transparent hover:bg-zinc-200")
                    }`}
                  >
                    <span className="text-base">🇨🇦</span>
                    <span className="text-xs">Canada</span>
                  </button>
                </div>
                <p className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Restricts trunks to specific country billing rates.</p>
              </div>

              {/* DNC Dialing selection */}
              <div className="space-y-2">
                <label className={`block text-[10px] font-bold font-mono tracking-wider uppercase ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>
                  Do you dial DNC numbers?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("dialDNC", "yes")}
                    className={`p-3 font-semibold rounded-xl border text-sm flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      dialDNC === "yes"
                        ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                        : (isDark ? "bg-[#0e0f14] text-zinc-400 border-zinc-800 hover:text-white" : "bg-[#f1f3f5] text-zinc-600 border-transparent hover:bg-zinc-200")
                    }`}
                  >
                    <span className="text-xs uppercase font-bold">Yes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("dialDNC", "no")}
                    className={`p-3 font-semibold rounded-xl border text-sm flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      dialDNC === "no"
                        ? (isDark ? "bg-white text-black border-white shadow-md" : "bg-[#181920] text-white border-[#181920] shadow-sm")
                        : (isDark ? "bg-[#0e0f14] text-zinc-400 border-zinc-800 hover:text-white" : "bg-[#f1f3f5] text-zinc-600 border-transparent hover:bg-zinc-200")
                    }`}
                  >
                    <span className="text-xs uppercase font-bold">No (Safe Scrub)</span>
                  </button>
                </div>
                <p className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Do Not Call scrub list compliance flag.</p>
              </div>

              {/* Auto Detected Country */}
              <div className="space-y-2">
                <label htmlFor="country" className={`block text-[10px] font-bold font-mono tracking-wider uppercase ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>Country</label>
                <input
                  {...register("country")}
                  type="text"
                  id="country"
                  name="country"
                  className={`w-full text-sm rounded-xl px-3.5 py-3.5 outline-none font-sans transition-all ${
                    isDark 
                      ? `border bg-[#0e0f14] text-white focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.country ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                      : `border bg-[#f1f3f5] text-zinc-900 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.country ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                  }`}
                />
                {validationErrors.country && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.country}
                  </p>
                )}
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              
              <div className="md:col-span-2">
                <label htmlFor="address" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>Address</label>
                <input
                  {...register("address")}
                  type="text"
                  id="address"
                  name="address"
                  placeholder="123 Outbound Boulevard, Suite 400"
                  className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all ${
                    isDark 
                      ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.address ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                      : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.address ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                  }`}
                />
                {validationErrors.address && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="city" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}>City</label>
                <input
                  {...register("city")}
                  type="text"
                  id="city"
                  name="city"
                  placeholder="New York"
                  className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all ${
                    isDark 
                      ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.city ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                      : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.city ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                  }`}
                />
                {validationErrors.city && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.city}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="state" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }`}>State</label>
                  <input
                    {...register("state")}
                    type="text"
                    id="state"
                    name="state"
                    placeholder="NY"
                    className={`w-full text-sm rounded-xl px-2 py-2.5 outline-none font-sans transition-all ${
                      isDark 
                        ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.state ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                        : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.state ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                    }`}
                  />
                  {validationErrors.state && (
                    <p className="text-[11px] text-rose-400 mt-1">Required</p>
                  )}
                </div>

                <div>
                  <label htmlFor="zipCode" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }`}>Zip</label>
                  <input
                    {...register("zipCode")}
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    placeholder="10001"
                    className={`w-full text-sm rounded-xl px-2 py-2.5 outline-none font-sans transition-all ${
                      isDark 
                        ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 ${validationErrors.zipCode ? 'border-rose-900/80 bg-rose-950/10' : 'border-zinc-800'}` 
                        : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 ${validationErrors.zipCode ? 'border-rose-300 bg-rose-50/50' : 'border-transparent'}`
                    }`}
                  />
                  {validationErrors.zipCode && (
                    <p className="text-[11px] text-rose-400 mt-1">Required</p>
                  )}
                </div>
              </div>

            </div>
          </div>


          {/* Section D: Additional Info & Submit */}
          <div className={`border rounded-2xl p-6 shadow-xs space-y-4 transition-all duration-300 ${
            isDark ? "bg-[#0b0c10]/70 border-zinc-800/80" : "bg-white border-[#eef0f5]"
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isDark ? "border-zinc-900" : "border-zinc-100"}`}>
              <div className="flex items-center space-x-2">
                <Settings className={`w-4 h-4 ${isDark ? "text-white" : "text-zinc-800"}`} />
                <h3 className={`font-sans font-bold text-sm tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                  Account Finalization
                </h3>
              </div>
              <span className={`text-[9px] font-mono font-semibold tracking-wider ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                SECURE PROVISIONING
              </span>
            </div>

            <div>
              <label htmlFor="additionalInfo" className={`block text-[10px] font-bold font-mono tracking-wider mb-1.5 uppercase ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}>
                Additional Information <span className={`font-normal ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>(Optional)</span>
              </label>
              <textarea
                {...register("additionalInfo")}
                id="additionalInfo"
                name="additionalInfo"
                rows={3}
                placeholder="Provide any custom dial routing specifications, caller ID requests, or IP addresses to whitelist."
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 outline-none font-sans transition-all resize-none ${
                  isDark 
                    ? `border bg-[#0e0f14] text-white placeholder-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-white/5 border-zinc-800` 
                    : `border bg-[#f1f3f5] text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-900/5 border-transparent`
                }`}
              ></textarea>
              {validationErrors.additionalInfo && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-0.5">
                  <AlertCircle className="w-3 h-3" /> {validationErrors.additionalInfo}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <div className="flex items-start space-x-3">
                <input
                  {...register("termsAccepted")}
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  className={`w-4 h-4 rounded mt-1 cursor-pointer transition-all ${
                    isDark 
                      ? "text-white border-zinc-800 bg-[#0e0f14] focus:ring-zinc-500" 
                      : "text-zinc-900 border-zinc-300 bg-[#f1f3f5] focus:ring-zinc-400"
                  }`}
                />
                <label htmlFor="termsAccepted" className={`text-xs leading-normal cursor-pointer select-none transition-colors ${
                  isDark ? "text-zinc-400" : "text-[#4a4c5a]"
                }`}>
                  I agree to the{" "}
                  <a 
                    href="https://sigmadialer.com/terms.html" 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`font-semibold hover:underline underline-offset-4 transition-colors ${
                      isDark ? "text-zinc-100 hover:text-white" : "text-zinc-900 hover:text-zinc-950"
                    }`}
                  >
                    Terms and Conditions
                  </a>{" "}
                  and understand that Sigma Dialer adheres strictly to FTC telemarketing rules, TCPA outbound dial time limits, and national DNC registry compliance.
                </label>
              </div>
              {validationErrors.termsAccepted && (
                <p className="text-[11px] text-rose-500 mt-2 font-bold flex items-center gap-0.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.termsAccepted}
                </p>
              )}
            </div>

            {/* Action button */}
            <div className={`pt-4 border-t flex items-center justify-between ${isDark ? "border-zinc-900" : "border-zinc-100"}`}>
              <div className={`flex items-center space-x-2 text-[10px] font-mono tracking-wider transition-colors ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>TLS END-TO-END SECURE</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center space-x-2 cursor-pointer shadow-lg active:scale-[0.98] ${
                  isDark 
                    ? "bg-white hover:bg-zinc-100 text-black shadow-zinc-950/80" 
                    : "bg-[#181920] hover:bg-zinc-900 text-white shadow-zinc-200"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Provisioning Team...</span>
                  </>
                ) : (
                  <>
                    <span>Send message</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </form>
  );
}
