/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  User,
  Bell,
  Mail,
  Shield,
  Activity,
  Globe,
  Lock,
  Save,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Info
} from "lucide-react";

interface SettingsPanelProps {
  onTriggerAction: (actionName: string, deviceName: string) => void;
}

export default function SettingsPanel({ onTriggerAction }: SettingsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"general" | "notifications" | "scans" | "security">("general");
  
  // State variables for toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [snmpPolling, setSnmpPolling] = useState(true);
  const [scanInterval, setScanInterval] = useState("15");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    onTriggerAction("Save settings block sync", "Domain Configuration Manager");
    setTimeout(() => {
      setSavedMsg(false);
    }, 2000);
  };

  return (
    <div id="settings-screen" className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-7rem)] overflow-hidden">
      
      {/* Settings Navigation Rails Left part */}
      <div className="md:col-span-1 bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-4 flex flex-col gap-2 shadow-xl backdrop-blur-md">
        <h3 className="text-[10px] text-[#64748b] font-bold uppercase tracking-widest px-3 py-2.5 font-mono">
          Platform Configuration
        </h3>
        
        <button
          onClick={() => setActiveSubTab("general")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
            activeSubTab === "general"
              ? "bg-[#1e293b] text-cyan-400 border border-[#334155]"
              : "text-[#cbd5e1] hover:bg-[#1e293b]/40 border border-transparent"
          }`}
        >
          <User className="w-4 h-4 text-cyan-400" />
          <span>Operator Profile</span>
        </button>

        <button
          onClick={() => setActiveSubTab("notifications")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
            activeSubTab === "notifications"
              ? "bg-[#1e293b] text-cyan-400 border border-[#334155]"
              : "text-[#cbd5e1] hover:bg-[#1e293b]/40 border border-transparent"
          }`}
        >
          <Bell className="w-4 h-4 text-cyan-400" />
          <span>Alarms & Notifications</span>
        </button>

        <button
          onClick={() => setActiveSubTab("scans")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
            activeSubTab === "scans"
              ? "bg-[#1e293b] text-cyan-400 border border-[#334155]"
              : "text-[#cbd5e1] hover:bg-[#1e293b]/40 border border-transparent"
          }`}
        >
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Scan Coordinates</span>
        </button>

        <button
          onClick={() => setActiveSubTab("security")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${
            activeSubTab === "security"
              ? "bg-[#1e293b] text-cyan-400 border border-[#334155]"
              : "text-[#cbd5e1] hover:bg-[#1e293b]/40 border border-transparent"
          }`}
        >
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Console Security</span>
        </button>
      </div>

      {/* Settings Form Body Right Part */}
      <form
        onSubmit={handleSave}
        className="md:col-span-3 bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between overflow-y-auto"
      >
        <div className="space-y-6">
          {savedMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-400">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Platform variables saved and synchronized across security groups.</span>
            </div>
          )}

          {/* Tab 1: General */}
          {activeSubTab === "general" && (
            <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="border-b border-[#1e293b] pb-3">
                <h4 className="text-sm font-bold text-white tracking-wide">Operator Profile Credentials</h4>
                <p className="text-[10px] text-[#64748b] font-mono uppercase mt-0.5">Manage session identifiers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-[#64748b] uppercase">Operator Name</label>
                  <input
                    type="text"
                    defaultValue="NOC Operator Alpha"
                    className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-xl text-xs text-[#cbd5e1] focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-[#64748b] uppercase">Email Mailbox</label>
                  <input
                    type="email"
                    defaultValue="admin@netverse.com"
                    className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-xl text-xs text-[#cbd5e1] focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-[#64748b] uppercase">Localized Language</label>
                  <select className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-xl text-xs text-[#cbd5e1] focus:outline-none focus:border-cyan-500">
                    <option value="en">English (US NOC standard)</option>
                    <option value="ja">Japanese (日本語)</option>
                    <option value="de">German (Deutsch)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-[#64748b] uppercase">Platform Theme Layout</label>
                  <select className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-xl text-xs text-[#cbd5e1] focus:outline-none focus:border-cyan-500">
                    <option value="dark">Cyber Slate (Dark - Default)</option>
                    <option value="light">High Contrast Corporate (Light)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Notifications */}
          {activeSubTab === "notifications" && (
            <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="border-b border-[#1e293b] pb-3">
                <h4 className="text-sm font-bold text-white tracking-wide">Alarms & Notification Channels</h4>
                <p className="text-[10px] text-[#64748b] font-mono uppercase mt-0.5">Toggle live alerts systems</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/40">
                  <div>
                    <h5 className="text-xs font-semibold text-[#f8fafc]">Dispatch Syslog Email Alerts</h5>
                    <p className="text-[10px] text-[#64748b] mt-0.5">Transmit active CRITICAL warnings to system administrator's inbox.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className="text-cyan-400 cursor-pointer"
                  >
                    {emailAlerts ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-[#475569]" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/40">
                  <div>
                    <h5 className="text-xs font-semibold text-[#f8fafc]">Live Browser Toast Alarms</h5>
                    <p className="text-[10px] text-[#64748b] mt-0.5">Show instant screen popup notices for newly registered hardware failures.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushAlerts(!pushAlerts)}
                    className="text-cyan-400 cursor-pointer"
                  >
                    {pushAlerts ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-[#475569]" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Scans */}
          {activeSubTab === "scans" && (
            <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="border-b border-[#1e293b] pb-3">
                <h4 className="text-sm font-bold text-white tracking-wide">Autonomous Network Scanning</h4>
                <p className="text-[10px] text-[#64748b] font-mono uppercase mt-0.5">Configure intervals for SNMP polling and heartbeats</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/40">
                  <div>
                    <h5 className="text-xs font-semibold text-[#f8fafc]">Background SNMP Monitoring</h5>
                    <p className="text-[10px] text-[#64748b] mt-0.5">Continuously pull chassis telemetry and port states from connected switches.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSnmpPolling(!snmpPolling)}
                    className="text-cyan-400 cursor-pointer"
                  >
                    {snmpPolling ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-[#475569]" />}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-[#64748b] uppercase">Polling Cycle Interval (Seconds)</label>
                    <select
                      value={scanInterval}
                      onChange={(e) => setScanInterval(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-xl text-xs text-[#cbd5e1] focus:outline-none focus:border-cyan-500"
                    >
                      <option value="5">Rapid Probe (5s - Debug mode)</option>
                      <option value="15">Operational Balanced (15s)</option>
                      <option value="60">Server Conserved (60s)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Security */}
          {activeSubTab === "security" && (
            <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="border-b border-[#1e293b] pb-3">
                <h4 className="text-sm font-bold text-white tracking-wide">Console Security & Cryptography</h4>
                <p className="text-[10px] text-[#64748b] font-mono uppercase mt-0.5">Enforce encryption thresholds</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/40">
                  <div>
                    <h5 className="text-xs font-semibold text-[#f8fafc]">Require Two-Factor MFA Token</h5>
                    <p className="text-[10px] text-[#64748b] mt-0.5">Require multi-factor validation codes for any cold switch reboots or remote CLI access.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMfaEnabled(!mfaEnabled)}
                    className="text-cyan-400 cursor-pointer"
                  >
                    {mfaEnabled ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-[#475569]" />}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-[#64748b] uppercase">Session Inactive Timeout (Minutes)</label>
                    <input
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-xl text-xs text-[#cbd5e1] focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Button Footer */}
        <div className="border-t border-[#1e293b]/60 pt-4 flex justify-end gap-2.5">
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Apply Sync Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}
