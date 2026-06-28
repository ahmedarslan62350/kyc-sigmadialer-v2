"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { AlertCircle, Loader2 } from "lucide-react";
import { registrationSchema, RegistrationInput } from "@/lib/validation";
import { getIp } from "@/lib/getIp";

interface OnboardingFormProps {
  onSuccess: (savedRecord: any) => void;
  theme: "light" | "dark";
}

export default function OnboardingForm({ onSuccess, theme }: OnboardingFormProps) {
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);
  const [ipStatus, setIpStatus] = useState<"loading" | "detected" | "failed">("loading");
  const [serverError, setServerError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { register, handleSubmit, setValue, watch } = useForm<RegistrationInput>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      companyName: "",
      companyRegistrationNo: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      role: "",
      numberOfAgents: 1,
      typeOfAgents: "Voice",
      campaign: "",
      dialDNC: "no",
      additionalInfo: "",
      termsAccepted: false,
    },
  });

  const typeOfAgents = watch("typeOfAgents");
  const dialDNC = watch("dialDNC");

  // IP-based auto-detection. getIp() is implemented in @/lib/getIp.
  useEffect(() => {
    async function autoDetectGeoIP() {
      setIpStatus("loading");
      try {
        const data = await getIp();

        if (data?.country_name) setValue("country", data.country_name);
        if (data?.country_calling_code) {
          setValue("contactNumber", `${data.country_calling_code} `);
        }

        setIpStatus("detected");
      } catch (err) {
        console.warn("GeoIP lookup failed. Defaulting to standard region US:", err);
        setIpStatus("failed");
        setValue("country", "United States");
        setValue("contactNumber", "+1 ");
      }
    }

    autoDetectGeoIP();
  }, [setValue]);

  const onSubmitForm = async (data: RegistrationInput) => {
    setLoading(true);
    setServerError(null);
    setValidationErrors({});

    const validation = registrationSchema.safeParse(data);
    if (!validation.success) {
      const flattened = validation.error.flatten().fieldErrors;
      const clientErrors: Record<string, string> = {};
      for (const key in flattened) {
        clientErrors[key] = flattened[key as keyof typeof flattened]?.[0] || "Invalid field value";
      }
      setValidationErrors(clientErrors);
      setLoading(false);

      const firstErrKey = Object.keys(clientErrors)[0];
      const element = document.getElementsByName(firstErrKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 400 && result.errors) {
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

  const labelClass = `block text-sm font-semibold mb-1.5 ${isDark ? "text-zinc-100" : "text-zinc-900"}`;
  const inputClass = (hasError: boolean) =>
    `w-full text-base rounded-md px-4 py-3 outline-none font-sans transition-colors border-2 ${isDark
      ? `bg-[#101114] text-white placeholder-zinc-500 focus:border-white ${hasError ? "border-rose-600" : "border-zinc-600"
      }`
      : `bg-white text-zinc-950 placeholder-zinc-400 focus:border-zinc-900 ${hasError ? "border-rose-500" : "border-zinc-400"
      }`
    }`;
  const errorTextClass = "text-xs text-rose-500 mt-1 flex items-center gap-1";
  const fieldWrapClass = "w-full";
  const rowClass = "grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6";
  const fullRowClass = "grid grid-cols-1 gap-5 mb-6";

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className={`max-w-4xl mx-auto pb-16 ${isDark ? "text-white" : "text-zinc-900"}`}
      noValidate
    >
      <h2 className={`text-4xl mx-auto font-extrabold mb-2 w-fit ${isDark ? "text-white" : "text-zinc-900"}`}>
        Let’s Map This to your Floor
      </h2>
      <p className={`mx-auto w-fit text-xl font-semibold mb-10 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Enter the required details below.</p>

      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 border rounded-md mb-6 text-sm flex items-start gap-2 ${isDark ? "bg-rose-950/20 border-rose-900 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold">Submission Refused</span>
            <p className="mt-1">{serverError}</p>
          </div>
        </motion.div>
      )}

      {/* First Name + Last Name */}
      <div className={rowClass}>
        <div className={fieldWrapClass}>
          <label htmlFor="firstName" className={labelClass}>First Name</label>
          <input
            {...register("firstName")}
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Jane"
            className={inputClass(!!validationErrors.firstName)}
          />
          {validationErrors.firstName && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.firstName}</p>
          )}
        </div>

        <div className={fieldWrapClass}>
          <label htmlFor="lastName" className={labelClass}>Last Name</label>
          <input
            {...register("lastName")}
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Doe"
            className={inputClass(!!validationErrors.lastName)}
          />
          {validationErrors.lastName && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email + Phone No */}
      <div className={rowClass}>
        <div className={fieldWrapClass}>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            {...register("email")}
            type="email"
            id="email"
            name="email"
            placeholder="jane@acme.com"
            className={inputClass(!!validationErrors.email)}
          />
          {validationErrors.email && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.email}</p>
          )}
        </div>

        <div className={fieldWrapClass}>
          <label htmlFor="contactNumber" className={labelClass}>Phone No</label>
          <input
            {...register("contactNumber")}
            type="tel"
            id="contactNumber"
            name="contactNumber"
            placeholder="+1 555-0199"
            className={inputClass(!!validationErrors.contactNumber)}
          />
          {validationErrors.contactNumber && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.contactNumber}</p>
          )}
        </div>
      </div>

      {/* Company Name + Company Registration No */}
      <div className={rowClass}>
        <div className={fieldWrapClass}>
          <label htmlFor="companyName" className={labelClass}>Company Name</label>
          <input
            {...register("companyName")}
            type="text"
            id="companyName"
            name="companyName"
            placeholder="Acme Contact Center"
            className={inputClass(!!validationErrors.companyName)}
          />
          {validationErrors.companyName && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.companyName}</p>
          )}
        </div>

        <div className={fieldWrapClass}>
          <label htmlFor="companyRegistrationNo" className={labelClass}>
            Company Registration No <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>(Optional)</span>
          </label>
          <input
            {...register("companyRegistrationNo")}
            type="text"
            id="companyRegistrationNo"
            name="companyRegistrationNo"
            placeholder="e.g. US-898239-BC"
            className={inputClass(!!validationErrors.companyRegistrationNo)}
          />
          {validationErrors.companyRegistrationNo && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.companyRegistrationNo}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className={fullRowClass}>
        <div className={fieldWrapClass}>
          <label htmlFor="address" className={labelClass}>Address</label>
          <input
            {...register("address")}
            type="text"
            id="address"
            name="address"
            placeholder="123 Outbound Boulevard, Suite 400"
            className={inputClass(!!validationErrors.address)}
          />
          {validationErrors.address && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.address}</p>
          )}
        </div>
      </div>

      {/* City + State */}
      <div className={rowClass}>
        <div className={fieldWrapClass}>
          <label htmlFor="city" className={labelClass}>City</label>
          <input
            {...register("city")}
            type="text"
            id="city"
            name="city"
            placeholder="New York"
            className={inputClass(!!validationErrors.city)}
          />
          {validationErrors.city && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.city}</p>
          )}
        </div>

        <div className={fieldWrapClass}>
          <label htmlFor="state" className={labelClass}>State</label>
          <input
            {...register("state")}
            type="text"
            id="state"
            name="state"
            placeholder="NY"
            className={inputClass(!!validationErrors.state)}
          />
          {validationErrors.state && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> Required</p>
          )}
        </div>
      </div>

      {/* Zip Code + Country */}
      <div className={rowClass}>
        <div className={fieldWrapClass}>
          <label htmlFor="zipCode" className={labelClass}>Zip Code</label>
          <input
            {...register("zipCode")}
            type="text"
            id="zipCode"
            name="zipCode"
            placeholder="10001"
            className={inputClass(!!validationErrors.zipCode)}
          />
          {validationErrors.zipCode && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> Required</p>
          )}
        </div>

        <div className={fieldWrapClass}>
          <label htmlFor="country" className={labelClass}>Country</label>
          <input
            {...register("country")}
            type="text"
            id="country"
            name="country"
            className={inputClass(!!validationErrors.country)}
          />
          {validationErrors.country && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.country}</p>
          )}
        </div>
      </div>

      {/* Your Designation */}
      <div className={fullRowClass}>
        <div className={fieldWrapClass}>
          <label htmlFor="role" className={labelClass}>Your Designation</label>
          <input
            {...register("role")}
            type="text"
            id="role"
            name="role"
            placeholder="e.g. Chief executive"
            className={inputClass(!!validationErrors.role)}
          />
          {validationErrors.role && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.role}</p>
          )}
        </div>
      </div>

      {/* Number of agents + Type of Agents */}
      <div className={rowClass}>
        <div className={fieldWrapClass}>
          <label htmlFor="numberOfAgents" className={labelClass}>Number of Agents</label>
          <input
            {...register("numberOfAgents")}
            type="number"
            id="numberOfAgents"
            name="numberOfAgents"
            min="1"
            max="10000"
            className={inputClass(!!validationErrors.numberOfAgents)}
          />
          {validationErrors.numberOfAgents && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.numberOfAgents}</p>
          )}
        </div>

        <div className={fieldWrapClass}>
          <label className={labelClass}>Type of Agents</label>
          <div className="flex gap-4 h-[46px] items-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={typeOfAgents === "Voice"}
                onChange={() => setValue("typeOfAgents", "Voice")}
              />
              Voice
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={typeOfAgents === "Bots"}
                onChange={() => setValue("typeOfAgents", "Bots")}
              />
              AI Bots
            </label>
          </div>
        </div>
      </div>

      {/* Campaign + Do you dial DNC numbers? */}
      <div className={rowClass}>
        <div className={fieldWrapClass}>
          <label htmlFor="campaign" className={labelClass}>Campaign</label>
          <input
            {...register("campaign")}
            type="text"
            id="campaign"
            name="campaign"
            placeholder="Enter your campaign name"
            className={inputClass(!!validationErrors.campaign)}
          />
          {validationErrors.campaign && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.campaign}</p>
          )}
        </div>

        <div className={fieldWrapClass}>
          <label className={labelClass}>Do you dial DNC numbers?</label>
          <div className="flex gap-4 h-[46px] items-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={dialDNC === "yes"}
                onChange={() => setValue("dialDNC", "yes")}
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={dialDNC === "no"}
                onChange={() => setValue("dialDNC", "no")}
              />
              No (Safe Scrub)
            </label>
          </div>
          <p className={`text-xs mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            Do Not Call scrub list compliance flag.
          </p>
        </div>
      </div>

      {/* Additional Information (optional) */}
      <div className={fullRowClass}>
        <div className={fieldWrapClass}>
          <label htmlFor="additionalInfo" className={labelClass}>
            Additional Information <span className={isDark ? "text-zinc-500" : "text-zinc-400"}>(Optional)</span>
          </label>
          <textarea
            {...register("additionalInfo")}
            id="additionalInfo"
            name="additionalInfo"
            rows={3}
            placeholder=""
            className={`${inputClass(false)} resize-none`}
          ></textarea>
          {validationErrors.additionalInfo && (
            <p className={errorTextClass}><AlertCircle className="w-3 h-3" /> {validationErrors.additionalInfo}</p>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="mb-6">
        <label className="flex items-start gap-2 text-sm cursor-pointer">
          <input
            {...register("termsAccepted")}
            type="checkbox"
            id="termsAccepted"
            name="termsAccepted"
            className="mt-1"
          />
          <span>
            I agree to the{" "}
            <a
              href="https://sigmadialer.com/terms.html"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline"
            >
              Terms and Conditions
            </a>{" "}
            and understand that Sigma Dialer adheres strictly to FTC telemarketing rules, TCPA outbound dial time
            limits, and national DNC registry compliance.
          </span>
        </label>
        {validationErrors.termsAccepted && (
          <p className="text-xs text-rose-500 mt-2 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.termsAccepted}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-6 py-3 text-sm font-bold rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${isDark ? "bg-white hover:bg-zinc-100 text-black" : "bg-zinc-900 hover:bg-zinc-800 text-white"
          }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <span>Complete Signup</span>
        )}
      </button>
    </form>
  );
}