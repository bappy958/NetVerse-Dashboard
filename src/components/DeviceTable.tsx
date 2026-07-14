/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Activity,
  Trash2,
  Play,
  RotateCcw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import { NetworkDevice, DeviceType, DeviceStatus } from "../types";

interface DeviceTableProps {
  devices: NetworkDevice[];
  onTriggerAction: (actionName: string, deviceName: string) => void;
  onDeleteDevice: (deviceId: string) => void;
  onAddMockDevice: () => void;
}

export default function DeviceTable({
  devices,
  onTriggerAction,
  onDeleteDevice,
  onAddMockDevice
}: DeviceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sorting
  const [sortField, setSortField] = useState<keyof NetworkDevice>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter & Search Logic
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm) ||
      device.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.hostname.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "ALL" || device.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || device.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort logic
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === "string") {
      valA = (valA as string).toLowerCase();
      valB = (valB as string).toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination bounds
  const totalPages = Math.ceil(sortedDevices.length / itemsPerPage) || 1;
  const paginatedDevices = sortedDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof NetworkDevice) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleExport = () => {
    // Generate simulated CSV file trigger download
    const headers = ["Device Name", "Device Type", "IP Address", "MAC Address", "Hostname", "Vendor", "Status", "Latency"];
    const rows = filteredDevices.map(d => [
      d.name,
      d.type,
      d.ip,
      d.mac,
      d.hostname,
      d.vendor,
      d.status,
      `${d.latency}ms`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NetVerse_Hardware_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onTriggerAction("CSV Database Export", "Hardware Catalog");
  };

  const getStatusStyle = (status: DeviceStatus) => {
    switch (status) {
      case DeviceStatus.ONLINE:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case DeviceStatus.OFFLINE:
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case DeviceStatus.WARNING:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case DeviceStatus.MAINTENANCE:
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div id="devices-dashboard" className="space-y-6">
      {/* Search and Filters Control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
            <input
              type="text"
              placeholder="Search by IP, MAC, hostname, name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all text-[#e2e8f0] placeholder-[#475569] font-sans"
            />
          </div>

          {/* Type Filter dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs">
            <Sliders className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-[#cbd5e1] focus:outline-none cursor-pointer text-xs pr-1"
            >
              <option value="ALL">All Hardware Types</option>
              <option value={DeviceType.ROUTER}>Routers</option>
              <option value={DeviceType.SWITCH}>Switches</option>
              <option value={DeviceType.SERVER}>Servers</option>
              <option value={DeviceType.WORKSTATION}>Workstations</option>
              <option value={DeviceType.PRINTER}>Printers</option>
              <option value={DeviceType.ACCESS_POINT}>WiFi APs</option>
            </select>
          </div>

          {/* Status Filter dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs">
            <Activity className="w-3.5 h-3.5 text-[#64748b]" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-[#cbd5e1] focus:outline-none cursor-pointer text-xs pr-1"
            >
              <option value="ALL">All Network States</option>
              <option value="ONLINE">Online State</option>
              <option value="OFFLINE">Offline State</option>
              <option value="WARNING">Alert Warnings</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Export / Add Node Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onAddMockDevice}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Provision Node
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-[#334155] hover:border-cyan-500/50 bg-[#1e293b]/40 text-[#cbd5e1] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e293b] bg-slate-900/30">
                <th
                  onClick={() => handleSort("name")}
                  className="p-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors font-mono"
                >
                  Device Name {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("ip")}
                  className="p-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors font-mono"
                >
                  IP Address {sortField === "ip" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider font-mono">
                  MAC Address
                </th>
                <th className="p-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider font-mono">
                  Hostname
                </th>
                <th className="p-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider font-mono">
                  Vendor
                </th>
                <th className="p-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider font-mono">
                  Type
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="p-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors font-mono"
                >
                  Status {sortField === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("latency")}
                  className="p-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors font-mono"
                >
                  Latency {sortField === "latency" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider font-mono">
                  Last Seen
                </th>
                <th className="p-4 text-xs font-semibold text-[#64748b] uppercase tracking-wider text-center font-mono">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {paginatedDevices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-400 font-sans">
                    <div className="flex flex-col items-center justify-center space-y-3.5 max-w-sm mx-auto">
                      <div className="p-3.5 bg-slate-900/50 rounded-full text-slate-500 border border-slate-800">
                        <Info className="w-7 h-7" />
                      </div>
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                        No hardware records matched
                      </h4>
                      <p className="text-xs text-[#64748b] leading-relaxed">
                        Refine your filtering inputs or query string. No physical hosts found on current subnets.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedDevices.map((device) => (
                  <tr
                    key={device.id}
                    className="hover:bg-[#1e293b]/30 transition-colors text-xs text-[#cbd5e1]"
                  >
                    {/* Name */}
                    <td className="p-4 font-semibold text-white">{device.name}</td>
                    {/* IP */}
                    <td className="p-4 font-mono font-medium text-cyan-400">{device.ip}</td>
                    {/* MAC */}
                    <td className="p-4 font-mono text-[#94a3b8]">{device.mac}</td>
                    {/* Hostname */}
                    <td className="p-4 font-mono text-[#cbd5e1]">{device.hostname}</td>
                    {/* Vendor */}
                    <td className="p-4 text-[#94a3b8]">{device.vendor}</td>
                    {/* Type */}
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/60 border border-slate-800/40 text-[10px] text-[#94a3b8] font-semibold tracking-wide uppercase">
                        {device.type.replace("_", " ")}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold uppercase ${getStatusStyle(device.status)}`}>
                        {device.status}
                      </span>
                    </td>
                    {/* Latency */}
                    <td className="p-4 font-mono font-bold text-slate-200">
                      {device.latency} ms
                    </td>
                    {/* Last Seen */}
                    <td className="p-4 font-mono text-[#64748b]">{device.lastSeen}</td>
                    {/* Action buttons */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2.5">
                        <button
                          onClick={() => onTriggerAction("ICMP Ping Check", device.name)}
                          title="Execute Ping"
                          className="p-1.5 bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 rounded-lg text-[#94a3b8] hover:text-cyan-400 active:scale-95 transition-all cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onTriggerAction("Snmpwalk Telemetry Pull", device.name)}
                          title="Diagnostics"
                          className="p-1.5 bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-lg text-[#94a3b8] hover:text-blue-400 active:scale-95 transition-all cursor-pointer"
                        >
                          <Sliders className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteDevice(device.id)}
                          title="De-provision Device"
                          className="p-1.5 bg-slate-900/50 border border-slate-800 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg text-[#94a3b8] hover:text-red-400 active:scale-95 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-4 border-t border-[#1e293b]/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/10">
          <span className="text-[11px] text-[#64748b] font-mono">
            Showing <span className="text-[#94a3b8]">{Math.min(filteredDevices.length, 1)}</span> to{" "}
            <span className="text-[#94a3b8]">
              {Math.min(currentPage * itemsPerPage, filteredDevices.length)}
            </span>{" "}
            of <span className="text-[#94a3b8]">{filteredDevices.length}</span> active assets
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-[#334155]/60 rounded-lg bg-slate-900/40 text-[#94a3b8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7.5 h-7.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  currentPage === idx + 1
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/15"
                    : "border border-[#334155]/40 text-[#94a3b8] hover:text-white"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-[#334155]/60 rounded-lg bg-slate-900/40 text-[#94a3b8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
