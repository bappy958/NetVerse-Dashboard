/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Network,
  Globe,
  HardDrive,
  Laptop,
  Printer,
  Wifi,
  Server as ServerIcon,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Cpu,
  Activity,
  Maximize2,
  Terminal,
  Zap,
  Info
} from "lucide-react";
import { NetworkDevice, DeviceType, DeviceStatus } from "../types";

interface TopologyMapProps {
  devices: NetworkDevice[];
  onTriggerAction: (actionName: string, deviceName: string) => void;
}

export default function TopologyMap({ devices, onTriggerAction }: TopologyMapProps) {
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [pinging, setPinging] = useState(false);
  const [rebooting, setRebooting] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [pulsing, setPulsing] = useState(true);

  // Default layout coordinates for nodes
  const nodes = [
    { id: "dev-0", type: DeviceType.GATEWAY, label: "WAN / Internet", level: 1, x: 50, y: 10 },
    { id: "dev-1", type: DeviceType.ROUTER, label: "Core Router CR-01", level: 2, x: 50, y: 30 },
    { id: "dev-2", type: DeviceType.SWITCH, label: "Core Switch CS-01", level: 3, x: 50, y: 50 },
    
    // Access Switches
    { id: "dev-3", type: DeviceType.SWITCH, label: "Access Switch AS-01", level: 4, x: 25, y: 70 },
    { id: "dev-4", type: DeviceType.SWITCH, label: "Access Switch AS-02", level: 4, x: 75, y: 70 },
    
    // Terminal devices connected to AS-01
    { id: "dev-5", type: DeviceType.SERVER, label: "Database Prod DB-01", level: 5, x: 10, y: 92 },
    { id: "dev-6", type: DeviceType.SERVER, label: "Storage NAS-01", level: 5, x: 20, y: 92 },
    { id: "dev-7", type: DeviceType.WORKSTATION, label: "Admin Console PC", level: 5, x: 30, y: 92 },
    { id: "dev-8", type: DeviceType.PRINTER, label: "PRN-OFFICE-01", level: 5, x: 40, y: 92 },
    
    // Terminal devices connected to AS-02
    { id: "dev-9", type: DeviceType.SERVER, label: "Mail Gateway MX-01", level: 5, x: 60, y: 92 },
    { id: "dev-10", type: DeviceType.ACCESS_POINT, label: "Corporate WiFi AP-01", level: 5, x: 70, y: 92 },
    { id: "dev-11", type: DeviceType.ACCESS_POINT, label: "Guest AP-02", level: 5, x: 80, y: 92 },
    { id: "dev-12", type: DeviceType.WORKSTATION, label: "NOC Client Workstation", level: 5, x: 90, y: 92 }
  ];

  // Map edges
  const edges = [
    { id: "e-1", source: "dev-0", target: "dev-1" },
    { id: "e-2", source: "dev-1", target: "dev-2" },
    
    // Core switch to Access switches
    { id: "e-3", source: "dev-2", target: "dev-3" },
    { id: "e-4", source: "dev-2", target: "dev-4" },
    
    // AS-01 sub-links
    { id: "e-5", source: "dev-3", target: "dev-5" },
    { id: "e-6", source: "dev-3", target: "dev-6" },
    { id: "e-7", source: "dev-3", target: "dev-7" },
    { id: "e-8", source: "dev-3", target: "dev-8" },
    
    // AS-02 sub-links
    { id: "e-9", source: "dev-4", target: "dev-9" },
    { id: "e-10", source: "dev-4", target: "dev-10" },
    { id: "e-11", source: "dev-4", target: "dev-11" },
    { id: "e-12", source: "dev-4", target: "dev-12" }
  ];

  // Match logical node template coordinates with actual backend device values
  const getDeviceForNode = (nodeId: string) => {
    return devices.find(d => d.id === nodeId) || null;
  };

  const handleNodeClick = (nodeId: string) => {
    const dev = getDeviceForNode(nodeId);
    if (dev) {
      setSelectedDevice(dev);
      setShowConsole(false);
    }
  };

  const handlePingTest = () => {
    if (!selectedDevice) return;
    setPinging(true);
    setConsoleLogs(prev => [...prev, `[CLI] ping ${selectedDevice.ip} -c 4`]);
    
    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev,
        `PING ${selectedDevice.ip} (${selectedDevice.ip}) 56(84) bytes of data.`,
        `64 bytes from ${selectedDevice.ip}: icmp_seq=1 ttl=64 time=${selectedDevice.latency} ms`,
        `64 bytes from ${selectedDevice.ip}: icmp_seq=2 ttl=64 time=${(selectedDevice.latency * 0.95).toFixed(1)} ms`,
        `64 bytes from ${selectedDevice.ip}: icmp_seq=3 ttl=64 time=${(selectedDevice.latency * 1.05).toFixed(1)} ms`,
        `--- ${selectedDevice.ip} ping statistics ---`,
        `4 packets transmitted, 4 received, 0% packet loss, rtt min/avg/max = ${(selectedDevice.latency * 0.9).toFixed(1)}/${selectedDevice.latency}/${(selectedDevice.latency * 1.1).toFixed(1)} ms`
      ]);
      setPinging(false);
      onTriggerAction("ICMP Ping Check", selectedDevice.name);
    }, 1500);
  };

  const handleReboot = () => {
    if (!selectedDevice) return;
    setRebooting(true);
    setConsoleLogs(prev => [...prev, `[CLI] snmp-set -v2c -c private ${selectedDevice.ip} .1.3.6.1.4.1.9.2.1.56.0 i 2 (Cold Start Request)`]);
    
    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev,
        `Connection closed by foreign host.`,
        `Polling device ${selectedDevice.name}... state transitioning to OFFLINE`,
        `Device handshake recovered. Core subsystems synchronized.`
      ]);
      setRebooting(false);
      onTriggerAction("Remote Hard Reboot", selectedDevice.name);
    }, 2500);
  };

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case DeviceType.GATEWAY:
        return Globe;
      case DeviceType.ROUTER:
        return Network;
      case DeviceType.SWITCH:
        return HardDrive;
      case DeviceType.SERVER:
        return ServerIcon;
      case DeviceType.WORKSTATION:
        return Laptop;
      case DeviceType.PRINTER:
        return Printer;
      case DeviceType.ACCESS_POINT:
        return Wifi;
      default:
        return Laptop;
    }
  };

  const getStatusColorClass = (status: DeviceStatus) => {
    switch (status) {
      case DeviceStatus.ONLINE:
        return "bg-emerald-500 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
      case DeviceStatus.WARNING:
        return "bg-amber-500 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]";
      case DeviceStatus.OFFLINE:
        return "bg-red-500 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
      case DeviceStatus.MAINTENANCE:
        return "bg-cyan-500 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
      default:
        return "bg-slate-500 text-slate-400 border-slate-500";
    }
  };

  // Pulse animation controller
  useEffect(() => {
    const timer = setInterval(() => {
      setPulsing(p => !p);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Filter coordinates based on search or status
  const filteredNodes = nodes.filter(node => {
    const dev = getDeviceForNode(node.id);
    if (!dev) return true;
    const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) || dev.ip.includes(searchQuery);
    const matchesStatus = statusFilter === "ALL" || dev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="topology-screen" className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Topology Canvas Left Part */}
      <div className="lg:col-span-3 bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-5 relative flex flex-col justify-between shadow-xl overflow-hidden">
        {/* Dynamic Canvas Floating Laser Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10 pointer-events-none" />

        {/* Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10 bg-slate-900/60 p-3.5 border border-slate-800/40 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Maximize2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              Physical Layer topology
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569]" />
              <input
                type="text"
                placeholder="Find node or subnet IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 pr-3 py-1.5 bg-[#0f172a] border border-[#334155] rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-all text-[#e2e8f0] w-48 placeholder-[#475569]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-[#0f172a] border border-[#334155] rounded-xl px-2.5 py-1">
              <Filter className="w-3 h-3 text-[#64748b]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-[#cbd5e1] focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL">All Nodes</option>
                <option value="ONLINE">Online Only</option>
                <option value="OFFLINE">Offline Only</option>
                <option value="WARNING">Alert State</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Topology Interactive Stage (Rendering via SVG) */}
        <div className="flex-1 min-h-[400px] flex items-center justify-center relative my-4 bg-[#090d16]/30 border border-slate-950 rounded-2xl overflow-auto select-none">
          <svg viewBox="0 0 1000 650" className="w-full h-full max-w-4xl max-h-[550px] overflow-visible">
            {/* SVG Cable Lines (Edges) */}
            <g id="edges-layer">
              {edges.map((edge) => {
                const srcNode = nodes.find(n => n.id === edge.source);
                const tgtNode = nodes.find(n => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;

                const srcDev = getDeviceForNode(srcNode.id);
                const tgtDev = getDeviceForNode(tgtNode.id);
                const isEdgeWarning = srcDev?.status === DeviceStatus.OFFLINE || tgtDev?.status === DeviceStatus.OFFLINE;

                // Scale grid values to SVG pixels (e.g. x: 50 -> 500, y: 10 -> 65)
                const sx = srcNode.x * 10;
                const sy = srcNode.y * 6;
                const tx = tgtNode.x * 10;
                const ty = tgtNode.y * 6;

                return (
                  <g key={edge.id}>
                    {/* Cable Outer Shadow Glow */}
                    <line
                      x1={sx}
                      y1={sy}
                      x2={tx}
                      y2={ty}
                      stroke={isEdgeWarning ? "#ef4444" : "#0ea5e9"}
                      strokeWidth="3.5"
                      strokeOpacity="0.1"
                      className="transition-all duration-500"
                    />
                    {/* Core Cable Line */}
                    <line
                      x1={sx}
                      y1={sy}
                      x2={tx}
                      y2={ty}
                      stroke={isEdgeWarning ? "#7f1d1d" : "#1e293b"}
                      strokeWidth="1.8"
                      strokeDasharray={isEdgeWarning ? "5,5" : "none"}
                      className="transition-all duration-500"
                    />

                    {/* Animated laser-pulse node flow */}
                    {!isEdgeWarning && pulsing && (
                      <circle r="3.5" className="fill-cyan-400 shadow-[0_0_8px_#22d3ee]">
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          path={`M ${sx},${sy} L ${tx},${ty}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </g>

            {/* SVG Interactive Nodes (Vertices) */}
            <g id="nodes-layer">
              {nodes.map((node) => {
                const dev = getDeviceForNode(node.id);
                if (!dev) return null;

                const isSelected = selectedDevice?.id === dev.id;
                const isFilteredOut = searchQuery && !filteredNodes.some(fn => fn.id === node.id);
                
                const nx = node.x * 10;
                const ny = node.y * 6;
                const NodeIcon = getDeviceIcon(node.type);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${nx}, ${ny})`}
                    onClick={() => handleNodeClick(node.id)}
                    className={`cursor-pointer transition-all duration-300 ${
                      isFilteredOut ? "opacity-25 scale-90" : "hover:scale-108"
                    }`}
                  >
                    {/* Selected Halo Outline */}
                    {isSelected && (
                      <circle
                        r="32"
                        className="fill-none stroke-cyan-500 stroke-[2px] animate-pulse"
                      />
                    )}

                    {/* Outer border backing */}
                    <circle
                      r="25"
                      className={`fill-slate-900 stroke-2 transition-colors ${
                        isSelected ? "stroke-cyan-400" : "stroke-slate-800"
                      }`}
                    />

                    {/* Node central icon wrapper */}
                    <foreignObject x="-14" y="-14" width="28" height="28">
                      <div className="w-full h-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors">
                        <NodeIcon className="w-5 h-5 text-[#94a3b8]" />
                      </div>
                    </foreignObject>

                    {/* Node status dot indicator */}
                    <circle
                      cx="18"
                      cy="-18"
                      r="6.5"
                      className={`${
                        dev.status === DeviceStatus.ONLINE
                          ? "fill-emerald-500"
                          : dev.status === DeviceStatus.WARNING
                          ? "fill-amber-500"
                          : "fill-red-500"
                      } stroke-slate-950 stroke-[1.5px]`}
                    />

                    {/* Text Label Backdrop Card */}
                    <rect
                      x="-70"
                      y="32"
                      width="140"
                      height="20"
                      rx="6"
                      className="fill-slate-950/80 stroke border-slate-900 stroke-[1px]"
                    />
                    
                    {/* Node Title Text */}
                    <text
                      y="45"
                      textAnchor="middle"
                      className="fill-slate-200 text-[9px] font-mono font-medium tracking-wide pointer-events-none"
                    >
                      {dev.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Grid Floor Labels */}
        <div className="flex justify-between items-center bg-slate-950/40 p-3 border border-slate-800/40 rounded-2xl text-[10px] text-[#475569] font-mono uppercase tracking-widest mt-1">
          <span>Boundary: External Edge Gateway</span>
          <span>Core Backbone Segment</span>
          <span>Intranet Ring: VLAN 10/20</span>
        </div>
      </div>

      {/* Node Context Control Drawer Right Part */}
      <div className="lg:col-span-1 bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 backdrop-blur-md flex flex-col justify-between shadow-xl overflow-y-auto">
        {selectedDevice ? (
          <div className="space-y-5 h-full flex flex-col justify-between">
            {/* Selected Header */}
            <div>
              <div className="flex items-center gap-3 border-b border-[#1e293b] pb-4 mb-4">
                <div className={`p-2.5 rounded-xl border ${getStatusColorClass(selectedDevice.status)}`}>
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">{selectedDevice.name}</h3>
                  <span className="text-[10px] text-[#64748b] font-mono">{selectedDevice.ip}</span>
                </div>
              </div>

              {/* Node Stats Metrics */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-3">
                    <span className="text-[9px] text-[#475569] font-mono uppercase block">System RTT</span>
                    <span className="text-xs font-bold text-[#e2e8f0] font-mono">{selectedDevice.latency} ms</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/40 rounded-xl p-3">
                    <span className="text-[9px] text-[#475569] font-mono uppercase block">Packet Loss</span>
                    <span className={`text-xs font-bold font-mono ${selectedDevice.packetLoss > 1 ? "text-red-400" : "text-emerald-400"}`}>
                      {selectedDevice.packetLoss}%
                    </span>
                  </div>
                </div>

                {/* Subsystem Health Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-[#64748b] mb-1">
                      <span>CPU LOAD</span>
                      <span className="text-cyan-400">{selectedDevice.cpuUsage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${selectedDevice.cpuUsage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-[#64748b] mb-1">
                      <span>MEM ALLOC</span>
                      <span className="text-blue-400">{selectedDevice.memoryUsage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${selectedDevice.memoryUsage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-[#64748b] mb-1">
                      <span>BANDWIDTH IN</span>
                      <span className="text-emerald-400">{selectedDevice.bandwidthIn} Mbps</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(selectedDevice.bandwidthIn / 1000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hardware Spec Meta */}
                <div className="border-t border-[#1e293b]/60 pt-4 space-y-2 text-[11px]">
                  <div className="flex justify-between font-mono">
                    <span className="text-[#475569]">MAC ADDR</span>
                    <span className="text-[#94a3b8]">{selectedDevice.mac}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-[#475569]">HOSTNAME</span>
                    <span className="text-[#94a3b8]">{selectedDevice.hostname}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-[#475569]">VENDOR</span>
                    <span className="text-[#94a3b8]">{selectedDevice.vendor}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-[#475569]">LAST HEARTBEAT</span>
                    <span className="text-[#94a3b8]">{selectedDevice.lastSeen}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Remote SSH Terminal Console Toggle */}
            <div className="space-y-3.5 mt-4">
              <button
                onClick={() => setShowConsole(!showConsole)}
                className="w-full py-2 border border-[#334155] rounded-xl text-xs font-mono font-bold text-[#cbd5e1] hover:text-white bg-slate-900/50 hover:bg-slate-900 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showConsole ? "Close Secure Shell" : "Establish Secure Shell"}</span>
              </button>

              {showConsole && (
                <div className="bg-black/90 rounded-xl p-3 border border-cyan-500/20 font-mono text-[9px] text-emerald-400 space-y-1.5 max-h-40 overflow-y-auto shadow-inner shadow-cyan-500/5">
                  <div className="text-slate-500">Establishing reverse SSH-tunnel proxy...</div>
                  <div className="text-cyan-400">root@netverse-shell:~$ _</div>
                  {consoleLogs.map((log, lIdx) => (
                    <div key={lIdx} className="leading-normal break-all">{log}</div>
                  ))}
                  {pinging && <div className="animate-pulse text-cyan-400">Awaiting ICMP echo responses...</div>}
                  {rebooting && <div className="animate-pulse text-amber-400">Triggering cold socket reboot loop...</div>}
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#1e293b]/60">
                <button
                  onClick={handlePingTest}
                  disabled={pinging || rebooting}
                  className="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10 cursor-pointer disabled:opacity-40"
                >
                  <Activity className={`w-3.5 h-3.5 ${pinging ? "animate-spin" : ""}`} />
                  <span>Ping Check</span>
                </button>
                <button
                  onClick={handleReboot}
                  disabled={pinging || rebooting}
                  className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-red-500/15 cursor-pointer disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${rebooting ? "animate-spin" : ""}`} />
                  <span>Hard Reboot</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 text-slate-400 space-y-3 font-sans">
            <div className="p-4 bg-[#1e293b]/40 border border-[#334155]/30 rounded-full text-slate-500">
              <Info className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">No Node Selected</h3>
            <p className="text-xs text-[#64748b] leading-relaxed max-w-xs">
              Select any live element on the topology grid left to establish a direct telemetric diagnostics session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
