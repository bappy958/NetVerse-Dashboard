/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Shield,
  Settings,
  HelpCircle,
  Network
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  isDark: boolean;
  toggleTheme: () => void;
  user: { name: string; email: string; role: string } | null;
  notifications: Array<{ id: string; text: string; time: string; read: boolean }>;
  markNotificationsAsRead: () => void;
  onLogout: () => void;
}

export default function Navbar({
  currentTab,
  isDark,
  toggleTheme,
  user,
  notifications,
  markNotificationsAsRead,
  onLogout
}: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  const getBreadcrumbs = () => {
    const formattedTab = currentTab.charAt(0).toUpperCase() + currentTab.slice(1);
    return [
      { label: "NetVerse", active: false },
      { label: formattedTab === "Assistant" ? "AI Copilot" : formattedTab, active: true }
    ];
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      id="top-nav"
      className="bg-[#0f172a]/95 border-b border-[#1e293b]/80 h-16 px-6 flex items-center justify-between relative z-20 backdrop-blur-md"
    >
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono">
        {getBreadcrumbs().map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-[#475569]">/</span>}
            <span
              className={`${
                crumb.active
                  ? "text-cyan-400 font-semibold"
                  : "text-[#64748b] hover:text-[#94a3b8] transition-colors cursor-pointer"
              }`}
            >
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Center Global Search (Aesthetic + Search Action Indicator) */}
      <div className="hidden md:flex items-center w-full max-w-sm relative">
        <Search className="absolute left-3 w-4 h-4 text-[#475569]" />
        <input
          type="text"
          placeholder="Search devices, alerts, configs, or queries..."
          className="w-full pl-9 pr-4 py-1.5 bg-[#1e293b]/40 border border-[#334155] rounded-xl text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all text-[#e2e8f0] placeholder-[#475569] font-sans"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Enable Light Mode" : "Enable Dark Mode"}
          className="p-2 bg-[#1e293b]/50 border border-[#334155]/60 hover:border-cyan-500/50 rounded-xl text-[#94a3b8] hover:text-cyan-400 active:scale-95 transition-all cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationsMenu(!showNotificationsMenu);
              setShowProfileMenu(false);
              if (!showNotificationsMenu) markNotificationsAsRead();
            }}
            className="p-2 bg-[#1e293b]/50 border border-[#334155]/60 hover:border-cyan-500/50 rounded-xl text-[#94a3b8] hover:text-cyan-400 active:scale-95 transition-all cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationsMenu && (
            <div className="absolute right-0 mt-3 w-80 bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#1e293b]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] font-mono">
                  Network Alerts
                </h3>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold font-mono">
                  {unreadCount} New
                </span>
              </div>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#475569] text-center py-4">
                    All core gateways reporting green. No active alarms.
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2 bg-[#1e293b]/40 hover:bg-[#1e293b]/80 border border-[#334155]/20 rounded-xl transition-all cursor-pointer flex gap-2.5"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs text-[#cbd5e1] leading-relaxed">
                          {notif.text}
                        </p>
                        <span className="text-[9px] text-[#475569] font-mono mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotificationsMenu(false);
              }}
              className="flex items-center gap-2 p-1.5 bg-[#1e293b]/40 border border-[#334155]/60 hover:border-cyan-500/50 rounded-xl text-[#cbd5e1] hover:text-[#f8fafc] transition-all cursor-pointer text-xs"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <span className="hidden sm:inline font-medium">{user.name.split(" ")[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl p-2 z-50 animate-[fadeIn_0.2s_ease-out]">
                <div className="p-3 border-b border-[#1e293b] mb-1">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-[#64748b] truncate font-mono mt-0.5">
                    {user.email}
                  </p>
                </div>
                
                <div className="space-y-0.5">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] rounded-lg transition-all text-left">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>My Credentials</span>
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] rounded-lg transition-all text-left">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Domain Security</span>
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] rounded-lg transition-all text-left">
                    <Settings className="w-4 h-4 text-cyan-400" />
                    <span>Terminal Config</span>
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] rounded-lg transition-all text-left">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    <span>Operations Manual</span>
                  </button>
                </div>

                <div className="border-t border-[#1e293b] mt-1.5 pt-1.5">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/5 rounded-lg transition-all text-left cursor-pointer"
                  >
                    <span>Emergency Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
