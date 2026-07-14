/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  TrendingUp,
  Activity,
  Server,
  Zap,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<"WEEKLY" | "MONTHLY">("WEEKLY");

  // Mock data for Traffic (Bandwidth)
  const trafficWeeklyData = [
    { name: "Mon", inbound: 420, outbound: 280, alerts: 1 },
    { name: "Tue", inbound: 510, outbound: 310, alerts: 3 },
    { name: "Wed", inbound: 780, outbound: 590, alerts: 5 }, // Spike
    { name: "Thu", inbound: 610, outbound: 450, alerts: 2 },
    { name: "Fri", inbound: 850, outbound: 680, alerts: 4 }, // Peak load
    { name: "Sat", inbound: 310, outbound: 190, alerts: 0 },
    { name: "Sun", inbound: 290, outbound: 150, alerts: 1 }
  ];

  const trafficMonthlyData = [
    { name: "Week 1", inbound: 3100, outbound: 1950, alerts: 12 },
    { name: "Week 2", inbound: 4500, outbound: 2800, alerts: 18 },
    { name: "Week 3", inbound: 5800, outbound: 3900, alerts: 24 },
    { name: "Week 4", inbound: 4100, outbound: 2600, alerts: 15 }
  ];

  // Mock Latency trend
  const latencyWeeklyData = [
    { name: "00:00", router: 4, switch1: 8, switch2: 12 },
    { name: "04:00", router: 5, switch1: 7, switch2: 15 },
    { name: "08:00", router: 12, switch1: 34, switch2: 84 }, // Load spikes
    { name: "12:00", router: 8, switch1: 22, switch2: 56 },
    { name: "16:00", router: 6, switch1: 18, switch2: 44 },
    { name: "20:00", router: 5, switch1: 9, switch2: 14 }
  ];

  // Device Growth Trend
  const deviceGrowthData = [
    { month: "Jan", routers: 1, switches: 2, servers: 3, clients: 12 },
    { month: "Feb", routers: 1, switches: 2, servers: 3, clients: 15 },
    { month: "Mar", routers: 1, switches: 2, servers: 4, clients: 18 },
    { month: "Apr", routers: 2, switches: 3, servers: 4, clients: 22 },
    { month: "May", routers: 2, switches: 4, servers: 5, clients: 35 }, // Scale expansion
    { month: "Jun", routers: 2, switches: 4, servers: 5, clients: 42 }
  ];

  // Protocol Distribution
  const protocolData = [
    { name: "HTTPS", value: 58, color: "#3b82f6" },
    { name: "TCP Session", value: 24, color: "#06b6d4" },
    { name: "SSH/SFTP", value: 10, color: "#10b981" },
    { name: "DNS Query", value: 5, color: "#f59e0b" },
    { name: "ICMP Probe", value: 3, color: "#ef4444" }
  ];

  // Top Active Devices by traffic
  const topDevicesData = [
    { name: "SRV-DB-PROD", bandwidth: 2350, type: "Server" },
    { name: "AS-02 Access Switch", bandwidth: 1890, type: "Switch" },
    { name: "CR-01 Core Router", bandwidth: 1420, type: "Router" },
    { name: "AP-OFFICE-01", bandwidth: 940, type: "WiFi AP" },
    { name: "SRV-NAS-STORAGE", bandwidth: 880, type: "Server" }
  ];

  // Packet Loss Data
  const lossData = [
    { time: "Mon", loss: 0.15 },
    { time: "Tue", loss: 0.22 },
    { time: "Wed", loss: 1.45 }, // Event
    { time: "Thu", loss: 0.31 },
    { time: "Fri", loss: 0.12 },
    { time: "Sat", loss: 0.08 },
    { time: "Sun", loss: 0.05 }
  ];

  const activeTraffic = timeframe === "WEEKLY" ? trafficWeeklyData : trafficMonthlyData;

  return (
    <div id="analytics-screen" className="space-y-6">
      {/* Analytics Page Title & Filter rail */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#1e293b]/40 border border-[#1e293b] rounded-3xl p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              System Telemetry Analytics
            </h2>
            <p className="text-[10px] text-[#64748b] font-mono uppercase mt-0.5">
              Timeframe range: Last 30 operational cycles
            </p>
          </div>
        </div>

        {/* Timeframe switchers */}
        <div className="flex bg-[#0f172a] border border-[#334155] rounded-xl p-1 shrink-0">
          <button
            onClick={() => setTimeframe("WEEKLY")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg font-mono transition-all duration-300 ${
              timeframe === "WEEKLY"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/10"
                : "text-[#64748b] hover:text-[#cbd5e1]"
            }`}
          >
            Weekly Audit
          </button>
          <button
            onClick={() => setTimeframe("MONTHLY")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg font-mono transition-all duration-300 ${
              timeframe === "MONTHLY"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/10"
                : "text-[#64748b] hover:text-[#cbd5e1]"
            }`}
          >
            Monthly Audit
          </button>
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Traffic Analytics Area Chart (Span 2) */}
        <div className="lg:col-span-2 bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                Live Traffic Bandwidth Allocation (Mbps)
              </h3>
            </div>
            <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-mono font-semibold uppercase">
              Throughput Realtime
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "12px"
                  }}
                  itemStyle={{ fontSize: "12px", fontFamily: "sans-serif" }}
                  labelStyle={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}
                />
                <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  name="Inbound RX"
                  dataKey="inbound"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorInbound)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  name="Outbound TX"
                  dataKey="outbound"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorOutbound)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Protocol Distribution Pie Chart (Span 1) */}
        <div className="bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Multiplexed Protocol Distribution
            </h3>
          </div>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={protocolData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {protocolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "12px"
                  }}
                  itemStyle={{ fontSize: "11px", color: "#cbd5e1" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-4">
            {protocolData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#64748b]">{item.name}</span>
                <span className="text-white font-bold ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Latency Trends Line Chart (Span 2) */}
        <div className="lg:col-span-2 bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                Subnet Latency Jitter Trend (ms RTT)
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-semibold uppercase">
              Healthy Baselines
            </span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyWeeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "12px"
                  }}
                  labelStyle={{ fontSize: "11px", color: "#64748b" }}
                />
                <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  name="Edge Core CR-01"
                  dataKey="router"
                  stroke="#ef4444"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  name="Switch Sub-Ring AS-01"
                  dataKey="switch1"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  name="Switch Sub-Ring AS-02"
                  dataKey="switch2"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Top Active Devices Bar Chart (Span 1) */}
        <div className="bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Server className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Top Active Subnet Hosts (GB Transmitted)
            </h3>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topDevicesData}
                layout="vertical"
                margin={{ top: 5, right: 5, left: 15, bottom: 5 }}
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="#475569" fontSize={9} fontFamily="monospace" />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={9} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "12px"
                  }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Bar dataKey="bandwidth" fill="#0ea5e9" radius={[0, 6, 6, 0]}>
                  {topDevicesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#ef4444" : index === 1 ? "#3b82f6" : "#06b6d4"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Device Growth Area Chart (Span 2) */}
        <div className="lg:col-span-2 bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Provisioned Network Growth Timeline
            </h3>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deviceGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "12px"
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "monospace" }} />
                <Area
                  type="monotone"
                  name="Edge Workstations"
                  dataKey="clients"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorClients)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  name="System Servers"
                  dataKey="servers"
                  stroke="#f59e0b"
                  fillOpacity={0}
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  name="Switches"
                  dataKey="switches"
                  stroke="#3b82f6"
                  fillOpacity={0}
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Packet Loss Jitter Bar Chart (Span 1) */}
        <div className="bg-[#1e293b]/60 border border-[#1e293b] rounded-3xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
              Packet Loss Index Rate (%)
            </h3>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lossData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "12px"
                  }}
                />
                <Bar dataKey="loss" fill="#ef4444" radius={[4, 4, 0, 0]}>
                  {lossData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.loss > 1.0 ? "#ef4444" : "#10b981"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
