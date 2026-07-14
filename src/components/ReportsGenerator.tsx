/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  FileText,
  Calendar,
  Clock,
  Download,
  CheckCircle,
  TrendingUp,
  Cpu,
  Shield,
  Activity,
  ArrowUpRight,
  Info
} from "lucide-react";

interface ReportsGeneratorProps {
  onTriggerAction: (actionName: string, deviceName: string) => void;
}

export default function ReportsGenerator({ onTriggerAction }: ReportsGeneratorProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const reportCards = [
    {
      id: "daily",
      title: "Daily Operations Briefing",
      description: "Automated synthesis of link availability, interface flaps, and active security blocklists over the last 24 hours.",
      frequency: "Every 24 Hours",
      fileSize: "420 KB",
      format: "PDF",
      lastRun: "Today, 08:00 UTC",
      metrics: { availability: "99.98%", alertsCleared: 14, trafficGB: "1,240 GB" }
    },
    {
      id: "weekly",
      title: "Weekly Network Performance & Audit",
      description: "Aggregated bandwidth metrics, subnet latency benchmarks, packet loss indices, and BGP reconvergence statistics.",
      frequency: "Every Sunday, 00:00 UTC",
      fileSize: "2.4 MB",
      format: "PDF / CSV",
      lastRun: "Jul 12, 2026",
      metrics: { availability: "99.95%", alertsCleared: 84, trafficGB: "8,950 GB" }
    },
    {
      id: "monthly",
      title: "Monthly Security & Compliance Report",
      description: "Detailed compliance auditing regarding firewall logs, authentication records, host isolation histories, and CVE scan results.",
      frequency: "1st of Every Month",
      fileSize: "14.2 MB",
      format: "PDF / XLSX / JSON",
      lastRun: "Jul 01, 2026",
      metrics: { availability: "99.91%", alertsCleared: 342, trafficGB: "38,420 GB" }
    }
  ];

  const handleExport = (reportId: string, format: string) => {
    setExporting(reportId);
    setTimeout(() => {
      setExporting(null);
      onTriggerAction(`Export ${format} of ${reportId} report`, "Reporting Engine");
      
      // Simulate file download
      const element = document.createElement("a");
      const fileContent = `NetVerse Network Administration Platform\nGenerated Report: ${reportId.toUpperCase()}\nDate: ${new Date().toISOString()}\nStatus: Verified Complete\n`;
      const file = new Blob([fileContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `NetVerse_${reportId}_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  return (
    <div id="reports-screen" className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              Operations & Compliance Reporting
            </h2>
            <p className="text-[10px] text-[#64748b] font-mono uppercase mt-0.5">
              Secure documentation compliant with ISO 27001 & SOC 2 SOC Audit guidelines
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Report templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCards.map((report) => (
          <div
            key={report.id}
            className="bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 group"
          >
            {/* Corner glows */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-transparent group-hover:from-cyan-500/3 transition-all duration-500" />
            
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60 text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-right font-mono text-[10px]">
                  <span className="text-[#64748b] block">FREQUENCY</span>
                  <span className="text-slate-300 font-semibold">{report.frequency}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">{report.title}</h3>
                <p className="text-xs text-[#94a3b8] mt-2 leading-relaxed">
                  {report.description}
                </p>
              </div>

              {/* Aggregated telemetry summaries */}
              <div className="bg-[#0f172a]/50 rounded-xl p-3 border border-[#334155]/20 space-y-2 text-[10.5px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Avg Link Availability</span>
                  <span className="text-emerald-400 font-bold">{report.metrics.availability}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Resolved Alarms</span>
                  <span className="text-cyan-400 font-bold">{report.metrics.alertsCleared}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Intranet Load</span>
                  <span className="text-white font-bold">{report.metrics.trafficGB}</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="border-t border-[#1e293b]/60 mt-5 pt-4 flex items-center justify-between gap-4">
              <div className="font-mono text-[9px] text-[#64748b]">
                <span>Last compiled: <br /><strong className="text-[#cbd5e1]">{report.lastRun}</strong></span>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={exporting !== null}
                  onClick={() => handleExport(report.id, "PDF")}
                  className="px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/15 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{exporting === report.id ? "PDF..." : "PDF"}</span>
                </button>
                <button
                  disabled={exporting !== null}
                  onClick={() => handleExport(report.id, "CSV")}
                  className="px-3 py-2 border border-[#334155] hover:border-cyan-500/50 bg-[#1e293b]/40 text-[#cbd5e1] hover:text-white font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{exporting === report.id ? "CSV..." : "CSV"}</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Compliance Shield card */}
      <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-3xl p-5 flex flex-col md:flex-row items-center gap-4 shadow-inner">
        <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl shrink-0">
          <Shield className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">Cryptographic Reporting Ledger Active</h4>
          <p className="text-xs text-[#94a3b8] leading-relaxed max-w-3xl">
            All reports compiled on the NetVerse platform are automatically cataloged with SHA-256 cryptographic hashes and signed with local domain credentials, verifying compliance records remain unmodified.
          </p>
        </div>
      </div>
    </div>
  );
}
