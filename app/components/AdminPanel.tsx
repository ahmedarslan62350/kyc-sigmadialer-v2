"use client";

import React, { useState, useEffect } from "react";
import { 
  Database, RefreshCw, Trash2, Calendar, ShieldCheck, 
  User, Check, Cpu, Sparkles, Building, AlertCircle, Info 
} from "lucide-react";

interface AdminPanelProps {
  refreshTrigger: number;
  theme?: "light" | "dark";
}

export default function AdminPanel({ refreshTrigger, theme = "light" }: AdminPanelProps) {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const isDark = theme === "dark";

  // Fetch DB Status and Submissions list
  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      // 1. Fetch DB Status
      const statusRes = await fetch("/api/db-status");
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setDbStatus(statusData);
      }

      // 2. Fetch submissions
      const submissionsRes = await fetch("/api/registrations");
      if (submissionsRes.ok) {
        const subData = await submissionsRes.json();
        setSubmissions(subData.data || []);
      } else {
        throw new Error("Failed to load registrations from backend");
      }
    } catch (err: any) {
      console.error("Failed to load admin panel details:", err);
      setFetchError(err?.message || "An error occurred while communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Handle Submission Deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this onboarding record?")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete record.");
      }
    } catch (err) {
      console.error("Error deleting registration:", err);
      alert("Error deleting registration.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div id="admin-panel-section" className="max-w-5xl mx-auto py-12 px-6 md:px-8 bg-transparent">
      {fetchError && (
        <div className={`p-4 rounded-xl text-sm mb-6 flex items-center gap-2 border ${
          isDark ? "bg-rose-950/20 border-rose-900 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600"
        }`}>
          <AlertCircle className="w-4 h-4" />
          <span>{fetchError}</span>
        </div>
      )}

      {/* Submissions Datagrid Table */}
      <div className={`border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
        isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-[#eef0f5]"
      }`}>
        <div className={`px-6 py-4 border-b flex justify-between items-center flex-wrap gap-2 ${
          isDark ? "border-zinc-900 bg-zinc-900/30" : "border-zinc-100 bg-[#f8fafc]"
        }`}>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isDark ? "bg-white" : "bg-zinc-800"}`}></span>
              <span className={`text-xs font-bold font-mono ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>Outbound Trunks</span>
            </div>
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className={`px-2.5 py-1 text-[10px] font-bold border rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
                isDark 
                  ? "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800" 
                  : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <RefreshCw className={`w-2.5 h-2.5 ${loading ? "animate-spin" : ""}`} />
              <span>Sync Records</span>
            </button>
          </div>
          <span className={`text-xs border font-semibold px-2.5 py-1 rounded-full ${
            isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-700"
          }`}>
            {submissions.length} Total Registrations
          </span>
        </div>

        {submissions.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <p className={`font-sans text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>No onboarding registrations found in the database.</p>
            <p className={`text-xs font-sans mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Fill out and submit the single page form above to populate records!</p>
          </div>
        ) : (
          <div className="overflow-x-auto font-sans">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-mono font-bold uppercase ${
                  isDark ? "border-zinc-900 text-zinc-500 bg-zinc-950" : "border-zinc-100 text-zinc-400 bg-[#f8fafc]"
                }`}>
                  <th className="py-4.5 px-6">Company</th>
                  <th className="py-4.5 px-6">Representative</th>
                  <th className="py-4.5 px-6">Agents & Type</th>
                  <th className="py-4.5 px-6">Location</th>
                  <th className="py-4.5 px-6">DNC Dial</th>
                  <th className="py-4.5 px-6">Created At</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${
                isDark ? "divide-zinc-900 bg-zinc-950" : "divide-zinc-100 bg-white"
              }`}>
                {submissions.map((sub: any) => (
                  <React.Fragment key={sub._id}>
                    <tr 
                      onClick={() => setExpandedRowId(expandedRowId === sub._id ? null : sub._id)}
                      className={`transition-colors cursor-pointer ${
                        isDark ? "hover:bg-zinc-900/40" : "hover:bg-zinc-50/50"
                      }`}
                    >
                      {/* Company */}
                      <td className={`py-4 px-6 font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>
                        <div>
                          <div className="font-sans font-bold flex items-center gap-1.5">
                            {sub.companyName}
                          </div>
                          <div className={`text-[10px] font-mono mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                            Reg: {sub.companyRegistrationNo || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Rep / Contact */}
                      <td className="py-4 px-6">
                        <div>
                          <div className={`font-sans font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                            {sub.firstName} {sub.lastName}
                          </div>
                          <div className={`text-xs font-mono mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                            {sub.role} | {sub.contactNumber}
                          </div>
                          <div className={`text-[10px] font-mono mt-0.5 max-w-[160px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                            {sub.email}
                          </div>
                        </div>
                      </td>

                      {/* Agents */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold font-mono ${isDark ? "text-white" : "text-zinc-900"}`}>
                            {sub.numberOfAgents}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            sub.typeOfAgents === "Voice" 
                              ? (isDark ? "bg-zinc-900 text-zinc-350 border-zinc-800" : "bg-zinc-100 text-zinc-600 border-zinc-200") 
                              : (isDark ? "bg-white text-black border-white" : "bg-[#181920] text-white border-[#181920]")
                          }`}>
                            {sub.typeOfAgents}
                          </span>
                        </div>
                        <div className={`text-[10px] font-sans mt-0.5 truncate max-w-[120px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                          Campaign: {sub.campaign}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6">
                        <div>
                          <div className={`font-semibold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                            {sub.city}, {sub.state}
                          </div>
                          <div className={`text-[10px] mt-0.5 truncate max-w-[150px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                            {sub.country}
                          </div>
                        </div>
                      </td>

                      {/* Dial DNC */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-mono font-bold border ${
                          sub.dialDNC === "no" 
                            ? (isDark ? "bg-emerald-950/20 text-emerald-400 border-emerald-900" : "bg-emerald-50 text-emerald-600 border-emerald-200") 
                            : (isDark ? "bg-amber-950/20 text-amber-400 border-amber-900" : "bg-amber-50 text-amber-600 border-amber-200")
                        }`}>
                          {sub.dialDNC === "no" ? "Safe Scrub" : "Dialing DNC"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className={`py-4 px-6 font-mono text-xs ${isDark ? "text-zinc-500" : "text-zinc-450"}`}>
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                    </tr>

                    {/* Expanded Row - Additional Details */}
                    {expandedRowId === sub._id && (
                      <tr>
                        <td colSpan={6} className={`p-4 ${isDark ? "bg-zinc-900/30" : "bg-zinc-50/50"}`}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <label className={`text-[10px] font-bold font-mono tracking-wider uppercase ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Full Address</label>
                              <p className={`mt-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                                {sub.address}
                              </p>
                            </div>
                            <div>
                              <label className={`text-[10px] font-bold font-mono tracking-wider uppercase ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>City, State, Zip</label>
                              <p className={`mt-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                                {sub.city}, {sub.state} {sub.zipCode}
                              </p>
                            </div>
                            <div>
                              <label className={`text-[10px] font-bold font-mono tracking-wider uppercase ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Country</label>
                              <p className={`mt-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                                {sub.country}
                              </p>
                            </div>
                            <div>
                              <label className={`text-[10px] font-bold font-mono tracking-wider uppercase ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Additional Information</label>
                              <p className={`mt-1 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                                {sub.additionalInfo || "None provided"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}