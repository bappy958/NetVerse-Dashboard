/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  LayoutDashboard,
  Server,
  Network,
  BarChart3,
  AlertOctagon,
  FileText,
  TrendingUp,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
  activeAlertsCount: number;
}

export default function Sidebar({
  currentTab,
  setTab,
  collapsed,
  setCollapsed,
  user,
  onLogout,
  activeAlertsCount
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "devices", label: "Devices", icon: Server },
    { id: "topology", label: "Topology", icon: Network },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "alerts", label: "Alert Center", icon: AlertOctagon, badge: activeAlertsCount },
    { id: "logs", label: "Activity Logs", icon: FileText },
    { id: "reports", label: "Reports", icon: TrendingUp },
    { id: "assistant", label: "AI Copilot", icon: Brain, highlight: true },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside
      id="sidebar-container"
      className={`bg-[#0f172a] border-r border-[#1e293b]/80 h-screen flex flex-col justify-between transition-all duration-300 relative z-30 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-6 -right-3.5 bg-[#1e293b] border border-[#334155] rounded-full p-1.5 text-cyan-400 hover:text-cyan-300 hover:scale-110 active:scale-95 transition-all cursor-pointer z-40 shadow-lg shadow-black/20"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Brand & Logo */}
      <div className="p-6">
        <div
          onClick={() => setTab("dashboard")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl shrink-0">
            <Shield className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-md opacity-30 group-hover:opacity-60 transition-opacity" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-lg font-bold tracking-widest bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-sans">
                NETVERSE
              </h2>
              <span className="text-[9px] text-[#475569] font-mono tracking-wider block uppercase">
                Enterprise AI v3.5
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav id="sidebar-nav" className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer relative group ${
                isActive
                  ? item.highlight
                    ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "bg-[#1e293b]/80 border border-[#334155] text-[#f8fafc] shadow-md shadow-black/10"
                  : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]/40 border border-transparent"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                  isActive
                    ? item.highlight
                      ? "text-cyan-400"
                      : "text-blue-400"
                    : "text-[#64748b] group-hover:text-[#94a3b8]"
                }`}
              />

              {!collapsed && (
                <span className="flex-1 text-left tracking-wide">{item.label}</span>
              )}

              {/* Glowing active bar */}
              {isActive && (
                <div
                  className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full ${
                    item.highlight ? "bg-cyan-400 shadow-[0_0_10px_#06b6d4]" : "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                  }`}
                />
              )}

              {/* Badge (e.g. for Active Alerts) */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`flex items-center justify-center text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    collapsed
                      ? "absolute top-2 right-2 bg-red-500 text-white animate-pulse"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for Collapsed view */}
              {collapsed && (
                <div className="absolute left-20 bg-[#0f172a] border border-[#1e293b] text-[#f8fafc] text-xs px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-xl z-50 pointer-events-none">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Operator profile card & Logout */}
      <div className="p-4 border-t border-[#1e293b]/60">
        {!collapsed && user && (
          <div className="bg-[#1e293b]/40 border border-[#334155]/30 rounded-xl p-3 mb-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-md shadow-blue-500/20">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-[#f8fafc] truncate">{user.name}</p>
              <p className="text-[10px] text-[#64748b] truncate font-mono uppercase">
                {user.role}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all cursor-pointer relative group"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0 text-red-400 group-hover:translate-x-0.5 transition-transform" />
          {!collapsed && <span className="tracking-wide">Emergency Logout</span>}
          
          {collapsed && (
            <div className="absolute left-20 bg-[#0f172a] border border-[#1e293b] text-red-400 text-xs px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-xl z-50 pointer-events-none">
              Emergency Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
