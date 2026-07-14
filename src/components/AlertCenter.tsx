/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ShieldAlert,
  BellOff,
  Maximize2,
  Cpu,
  Info
} from "lucide-react";
import { NetworkAlert, AlertSeverity, AlertStatus } from "../types";

interface AlertCenterProps {
  alerts: NetworkAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onTriggerAction: (actionName: string, deviceName: string) => void;
}

export default function AlertCenter({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
  onTriggerAction
}: AlertCenterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.deviceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === "ALL" || alert.severity === severityFilter;
    const matchesCategory = categoryFilter === "ALL" || alert.category === categoryFilter;

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const getSeverityStyle = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
      case AlertSeverity.HIGH:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case AlertSeverity.MEDIUM:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case AlertSeverity.LOW:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusIcon = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.ACTIVE:
        return <Clock className="w-4 h-4 text-red-400 animate-pulse" />;
      case AlertStatus.ACKNOWLEDGED:
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case AlertStatus.RESOLVED:
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div id="alerts-screen" className="space-y-6">
      {/* Alert Header Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
            <input
              type="text"
              placeholder="Search alerts by logs or devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all text-[#e2e8f0] placeholder-[#475569] font-sans"
            />
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent text-[#cbd5e1] focus:outline-none cursor-pointer text-xs pr-1"
            >
              <option value="ALL">All Severities</option>
              <option value={AlertSeverity.CRITICAL}>Critical Alarms</option>
              <option value={AlertSeverity.HIGH}>High Warnings</option>
              <option value={AlertSeverity.MEDIUM}>Medium Alerts</option>
              <option value={AlertSeverity.LOW}>Low Notes</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs">
            <Cpu className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-[#cbd5e1] focus:outline-none cursor-pointer text-xs pr-1"
            >
              <option value="ALL">All Categories</option>
              <option value="SECURITY">Security Threats</option>
              <option value="PERFORMANCE">Telemetry Anomalies</option>
              <option value="HARDWARE">Physical Layer</option>
              <option value="SYSTEM">Gateway Core</option>
            </select>
          </div>
        </div>

        {/* Clear/Mute Summary */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748b] bg-slate-900/40 border border-slate-800 px-3 py-2.5 rounded-xl shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>Active Alerts Queue: <strong className="text-red-400 font-bold">{alerts.filter(a => a.status === AlertStatus.ACTIVE).length}</strong></span>
        </div>
      </div>

      {/* Alarms Feed List */}
      <div id="alerts-feed-wrapper" className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-16 text-center shadow-lg">
            <div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
              <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                Subnet Intranet Clean
              </h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                All monitoring telemetry routes reporting green. No warnings or hardware failures flagged in this timeline.
              </p>
            </div>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-[#1e293b]/50 border border-[#1e293b] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-cyan-500/30 ${
                alert.status === AlertStatus.RESOLVED ? "opacity-60" : "shadow-md shadow-black/5"
              }`}
            >
              {/* Alert Content Left Column */}
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${getSeverityStyle(alert.severity)}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-wide ${getSeverityStyle(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-[9px] text-[#64748b] font-mono font-semibold tracking-wider">
                      {alert.category}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold hover:underline cursor-pointer">
                      @{alert.deviceName}
                    </span>
                  </div>
                  <p className="text-xs text-white mt-1.5 leading-relaxed font-semibold">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-[#64748b] font-mono">
                    <span>Handshake ID: {alert.id}</span>
                    <span>•</span>
                    <span>Received: {alert.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Alert Controller Buttons Right Column */}
              <div className="flex items-center gap-2.5 shrink-0 pl-14 md:pl-0">
                {/* Status badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-[#cbd5e1]">
                  {getStatusIcon(alert.status)}
                  <span className="text-[10px] font-semibold uppercase">{alert.status}</span>
                </div>

                {alert.status === AlertStatus.ACTIVE && (
                  <button
                    onClick={() => {
                      onAcknowledgeAlert(alert.id);
                      onTriggerAction("Mute Alert SNMP Sync", alert.deviceName);
                    }}
                    className="px-3.5 py-1.5 border border-[#334155] hover:border-cyan-500/50 bg-[#1e293b]/40 text-[#cbd5e1] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <BellOff className="w-3.5 h-3.5" />
                    <span>Acknowledge</span>
                  </button>
                )}

                {alert.status !== AlertStatus.RESOLVED && (
                  <button
                    onClick={() => {
                      onResolveAlert(alert.id);
                      onTriggerAction("Resolve Warning Signal", alert.deviceName);
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Clear Alarm</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
