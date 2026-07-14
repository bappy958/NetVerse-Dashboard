/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Filter,
  ShieldAlert,
  Terminal,
  Clock,
  RefreshCw,
  FileText,
  Sliders,
  Play,
  ArrowUpRight,
  Info
} from "lucide-react";
import { NetworkLog } from "../types";

interface LogViewerProps {
  logs: NetworkLog[];
}

export default function LogViewer({ logs }: LogViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter;
    const matchesCategory = categoryFilter === "ALL" || log.category === categoryFilter;

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-emerald-500 shadow-[0_0_10px_#10b981]";
      case "FAILED":
        return "bg-red-500 shadow-[0_0_10px_#ef4444]";
      case "PENDING":
        return "bg-amber-500 shadow-[0_0_10px_#f59e0b]";
      default:
        return "bg-blue-500 shadow-[0_0_10px_#3b82f6]";
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "HIGH":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "MEDIUM":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "LOW":
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
      default:
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    }
  };

  return (
    <div id="logs-screen" className="space-y-6">
      {/* Logs Header Control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
            <input
              type="text"
              placeholder="Query Syslog, trap codes, port IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all text-[#e2e8f0] placeholder-[#475569] font-sans"
            />
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs">
            <Sliders className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-[#cbd5e1] focus:outline-none cursor-pointer text-xs pr-1"
            >
              <option value="ALL">All Event Severities</option>
              <option value="CRITICAL">Critical Incidents</option>
              <option value="HIGH">High Warnings</option>
              <option value="MEDIUM">Medium Events</option>
              <option value="LOW">Low Logs</option>
              <option value="INFO">Informational Only</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs">
            <FileText className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-[#cbd5e1] focus:outline-none cursor-pointer text-xs pr-1"
            >
              <option value="ALL">All Facility Classes</option>
              <option value="Security Daemon">Security Daemon (auth)</option>
              <option value="Link Layer">Link Layer Protocol</option>
              <option value="Hardware Module">Hardware Chassis (chass)</option>
              <option value="SNMP Traps">SNMP Trap Facility</option>
              <option value="System Monitor">System Daemon (syslog)</option>
            </select>
          </div>
        </div>

        {/* Live streaming status */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#0e1726] border border-[#1e293b] rounded-xl shrink-0 font-mono text-[10px] text-cyan-400">
          <Terminal className="w-3.5 h-3.5 animate-pulse" />
          <span>Syslog Terminal Buffer Live</span>
        </div>
      </div>

      {/* Timeline view */}
      <div className="bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-6 shadow-xl relative backdrop-blur-md">
        <div className="absolute left-10.5 top-8 bottom-8 w-[2px] bg-slate-800/80 pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 pl-14 font-sans">
              <div className="flex flex-col items-center justify-center space-y-3.5 max-w-xs mx-auto">
                <div className="p-3 bg-slate-900/50 rounded-full text-slate-500 border border-slate-800">
                  <Info className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                  No log entries matched
                </h4>
                <p className="text-xs text-[#64748b]">
                  Try widening your facility filter query or search term string.
                </p>
              </div>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex gap-6 group">
                {/* Timeline connector status dot */}
                <div className="relative shrink-0 flex items-center justify-center mt-1.5 z-20">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-slate-950 transition-all group-hover:scale-125 ${getStatusDotColor(log.status)}`} />
                </div>

                {/* Log Entry Body Card */}
                <div className="flex-1 bg-[#0f172a]/60 border border-[#1e293b]/80 group-hover:border-cyan-500/20 rounded-2xl p-4 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Outer gradient hover highlights */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-transparent group-hover:from-cyan-500/3 transition-all" />
                  
                  {/* Left block: timestamp & message */}
                  <div className="space-y-1.5 max-w-2xl relative z-10">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[10px] font-mono font-semibold text-[#64748b] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.timestamp}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-cyan-400">
                        @{log.deviceName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[9px] text-[#64748b] font-mono font-medium tracking-wide uppercase">
                        {log.category}
                      </span>
                    </div>
                    
                    <p className="text-xs font-mono text-[#cbd5e1] leading-relaxed break-all">
                      {log.event}
                    </p>
                  </div>

                  {/* Right block: severity & status */}
                  <div className="flex items-center gap-2.5 shrink-0 relative z-10 pl-0 md:pl-4">
                    <span className={`px-2 py-0.5 border rounded-full text-[9.5px] font-mono font-bold tracking-wider ${getSeverityStyle(log.severity)}`}>
                      {log.severity}
                    </span>
                    
                    <span className="text-[10px] bg-slate-900 border border-slate-800/80 text-[#cbd5e1] font-mono font-bold px-2 py-1 rounded-lg">
                      {log.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
