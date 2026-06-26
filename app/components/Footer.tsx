"use client";

import React from "react";

interface FooterProps {
  theme?: "light" | "dark";
}

export default function Footer({ theme = "dark" }: FooterProps) {
  const isDark = theme === "dark";

  return (
    <footer className={`w-full transition-colors duration-300 pt-16 pb-8 px-6 md:px-12 mt-12 ${
      isDark ? "bg-[#070709]/80 border-t border-zinc-900" : "bg-[#f8fafc] border-t border-gray-100/80"
    }`}>
      <div className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b ${
        isDark ? "border-zinc-900" : "border-gray-100"
      }`}>
        
        {/* Brand Information Column */}
        <div className="md:col-span-4 space-y-4">
          <span className={`font-sans font-extrabold text-base tracking-tight block ${
            isDark ? "text-zinc-100" : "text-gray-900"
          }`}>
            Sigma Dialer
          </span>
          <p className={`text-xs md:text-[13px] leading-relaxed max-w-sm ${
            isDark ? "text-zinc-400" : "text-gray-500"
          }`}>
            The cloud contact-center platform for teams who actually hit the phones.
          </p>

          {/* Compliance Certifications Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs ${
              isDark ? "text-zinc-400 bg-[#0e0f14] border border-zinc-800" : "text-gray-500 bg-white border border-gray-200"
            }`}>
              SOC 2 Type II
            </span>
            <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs ${
              isDark ? "text-zinc-400 bg-[#0e0f14] border border-zinc-800" : "text-gray-500 bg-white border border-gray-200"
            }`}>
              HIPAA
            </span>
            <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs ${
              isDark ? "text-zinc-400 bg-[#0e0f14] border border-zinc-800" : "text-gray-500 bg-white border border-gray-200"
            }`}>
              GDPR
            </span>
          </div>
        </div>

        {/* Links Column: Product */}
        <div className="md:col-span-2 space-y-3">
          <h4 className={`text-[11px] font-mono font-bold uppercase tracking-widest ${
            isDark ? "text-zinc-600" : "text-gray-400"
          }`}>
            Product
          </h4>
          <ul className={`space-y-2 text-xs font-semibold ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
            <li><a href="#platform" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>Platform</a></li>
            <li><a href="#features" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>Features</a></li>
            <li><a href="#architecture" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>Architecture</a></li>
            <li><a href="#intelligence" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>Intelligence</a></li>
            <li><a href="#vs-legacy" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>vs legacy</a></li>
          </ul>
        </div>

        {/* Links Column: Company */}
        <div className="md:col-span-2 space-y-3">
          <h4 className={`text-[11px] font-mono font-bold uppercase tracking-widest ${
            isDark ? "text-zinc-600" : "text-gray-400"
          }`}>
            Company
          </h4>
          <ul className={`space-y-2 text-xs font-semibold ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
            <li><a href="#about" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>About</a></li>
            <li><a href="#careers" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>Careers</a></li>
            <li><a href="#customers" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>Customers</a></li>
            <li><a href="#press" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>Press</a></li>
          </ul>
        </div>

        {/* Links Column: Developers */}
        <div className="md:col-span-2 space-y-3">
          <h4 className={`text-[11px] font-mono font-bold uppercase tracking-widest ${
            isDark ? "text-zinc-600" : "text-gray-400"
          }`}>
            Developers
          </h4>
          <ul className={`space-y-2 text-xs font-semibold ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
            <li><a href="#api" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>API reference</a></li>
            <li><a href="#webhooks" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>Webhooks</a></li>
            <li><a href="#status" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>Status</a></li>
            <li><a href="#security" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>Security</a></li>
          </ul>
        </div>

        {/* Links Column: Contact */}
        <div className="md:col-span-2 space-y-3">
          <h4 className={`text-[11px] font-mono font-bold uppercase tracking-widest ${
            isDark ? "text-zinc-600" : "text-gray-400"
          }`}>
            Contact
          </h4>
          <ul className={`space-y-2 text-xs font-semibold font-sans ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
            <li>
              <a href="mailto:sales@sigmadialer.com" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>
                sales@sigmadialer.com
              </a>
            </li>
            <li>
              <a href="mailto:support@sigmadialer.com" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-gray-900"}`}>
                support@sigmadialer.com
              </a>
            </li>
            <li className={`font-medium pt-1 ${isDark ? "text-zinc-300" : "text-gray-600"}`}>
              (+1) 888-333-4254
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal bar */}
      <div className={`max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-medium ${
        isDark ? "text-zinc-500" : "text-gray-400"
      }`}>
        <div>
          <span>© 2026 Sigma Dialer, LLC. · Made for teams who dial for a living.</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#privacy" className={`transition-colors ${isDark ? "hover:text-zinc-300" : "hover:text-gray-700"}`}>Privacy</a>
          <a href="https://sigmadialer.com/terms.html" target="_blank" rel="noreferrer" className={`transition-colors ${isDark ? "hover:text-zinc-300" : "hover:text-gray-700"}`}>Terms</a>
          <a href="#dpa" className={`transition-colors ${isDark ? "hover:text-zinc-300" : "hover:text-gray-700"}`}>DPA</a>
          <a href="#do-not-sell" className={`transition-colors ${isDark ? "hover:text-zinc-300" : "hover:text-gray-700"}`}>Do not sell</a>
        </div>
      </div>
    </footer>
  );
}
