/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DeviceType, DeviceStatus, NetworkDevice, NetworkAlert, NetworkLog, AlertSeverity, AlertStatus } from "./types";
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardView from "./components/DashboardView";
import DeviceTable from "./components/DeviceTable";
import TopologyMap from "./components/TopologyMap";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AlertCenter from "./components/AlertCenter";
import LogViewer from "./components/LogViewer";
import ReportsGenerator from "./components/ReportsGenerator";
import ChatBot from "./components/ChatBot";
import SettingsPanel from "./components/SettingsPanel";
import { Bell, Info, ShieldAlert, WifiOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// Pre-configured mock network devices
const INITIAL_DEVICES: NetworkDevice[] = [
  {
    id: "dev-0",
    name: "WAN Gateway",
    ip: "8.8.8.8",
    mac: "00:1A:2B:3C:4D:5E",
    hostname: "edge-wan.netverse.net",
    vendor: "Cisco Systems",
    type: DeviceType.GATEWAY,
    status: DeviceStatus.ONLINE,
    latency: 8,
    packetLoss: 0.0,
    lastSeen: "15:35:50",
    bandwidthIn: 840,
    bandwidthOut: 620,
    cpuUsage: 12,
    memoryUsage: 24,
    connections: ["dev-1"]
  },
  {
    id: "dev-1",
    name: "Core Router CR-01",
    ip: "192.168.1.1",
    mac: "00:2A:3B:4C:5D:6E",
    hostname: "gw-core.netverse.local",
    vendor: "Juniper Networks",
    type: DeviceType.ROUTER,
    status: DeviceStatus.ONLINE,
    latency: 4,
    packetLoss: 0.0,
    lastSeen: "15:35:55",
    bandwidthIn: 780,
    bandwidthOut: 590,
    cpuUsage: 22,
    memoryUsage: 45,
    connections: ["dev-0", "dev-2"]
  },
  {
    id: "dev-2",
    name: "Core Switch CS-01",
    ip: "192.168.1.2",
    mac: "00:3A:4B:5C:6D:7E",
    hostname: "sw-core.netverse.local",
    vendor: "Arista Networks",
    type: DeviceType.SWITCH,
    status: DeviceStatus.ONLINE,
    latency: 2,
    packetLoss: 0.0,
    lastSeen: "15:35:58",
    bandwidthIn: 920,
    bandwidthOut: 840,
    cpuUsage: 18,
    memoryUsage: 38,
    connections: ["dev-1", "dev-3", "dev-4"]
  },
  {
    id: "dev-3",
    name: "Access Switch AS-01",
    ip: "192.168.1.3",
    mac: "00:4A:5B:6C:7D:8E",
    hostname: "sw-access-01.netverse.local",
    vendor: "Cisco Catalyst",
    type: DeviceType.SWITCH,
    status: DeviceStatus.ONLINE,
    latency: 5,
    packetLoss: 0.0,
    lastSeen: "15:35:57",
    bandwidthIn: 410,
    bandwidthOut: 320,
    cpuUsage: 28,
    memoryUsage: 52,
    connections: ["dev-2", "dev-5", "dev-6", "dev-7", "dev-8"]
  },
  {
    id: "dev-4",
    name: "Access Switch AS-02",
    ip: "192.168.1.4",
    mac: "00:5A:6B:7C:8D:9E",
    hostname: "sw-access-02.netverse.local",
    vendor: "Cisco Catalyst",
    type: DeviceType.SWITCH,
    status: DeviceStatus.WARNING,
    latency: 142, // Anomalous latency spike
    packetLoss: 1.4,
    lastSeen: "15:35:54",
    bandwidthIn: 480,
    bandwidthOut: 390,
    cpuUsage: 64,
    memoryUsage: 62,
    connections: ["dev-2", "dev-9", "dev-10", "dev-11", "dev-12"]
  },
  {
    id: "dev-5",
    name: "Database Prod DB-01",
    ip: "192.168.10.45",
    mac: "00:6A:7B:8C:9D:0E",
    hostname: "srv-db-prod.netverse.local",
    vendor: "Dell EMC",
    type: DeviceType.SERVER,
    status: DeviceStatus.ONLINE,
    latency: 3,
    packetLoss: 0.0,
    lastSeen: "15:35:59",
    bandwidthIn: 240,
    bandwidthOut: 380,
    cpuUsage: 45,
    memoryUsage: 78,
    connections: ["dev-3"]
  },
  {
    id: "dev-6",
    name: "Storage NAS-01",
    ip: "192.168.10.100",
    mac: "00:7A:8B:9C:0D:1E",
    hostname: "srv-nas-01.netverse.local",
    vendor: "Synology Inc.",
    type: DeviceType.SERVER,
    status: DeviceStatus.ONLINE,
    latency: 6,
    packetLoss: 0.0,
    lastSeen: "15:35:52",
    bandwidthIn: 180,
    bandwidthOut: 240,
    cpuUsage: 14,
    memoryUsage: 42,
    connections: ["dev-3"]
  },
  {
    id: "dev-7",
    name: "Admin Console PC",
    ip: "192.168.10.12",
    mac: "00:8A:9B:0C:1D:2E",
    hostname: "host-admin-pc.netverse.local",
    vendor: "HP Enterprise",
    type: DeviceType.WORKSTATION,
    status: DeviceStatus.ONLINE,
    latency: 4,
    packetLoss: 0.0,
    lastSeen: "15:35:58",
    bandwidthIn: 45,
    bandwidthOut: 12,
    cpuUsage: 8,
    memoryUsage: 15,
    connections: ["dev-3"]
  },
  {
    id: "dev-8",
    name: "PRN-OFFICE-01",
    ip: "192.168.1.150",
    mac: "00:9A:0B:1C:2D:3E",
    hostname: "prn-office-01.netverse.local",
    vendor: "Brother Industries",
    type: DeviceType.PRINTER,
    status: DeviceStatus.OFFLINE, // Printer offline state
    latency: 0,
    packetLoss: 100.0,
    lastSeen: "08:12:14",
    bandwidthIn: 0,
    bandwidthOut: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    connections: ["dev-3"]
  },
  {
    id: "dev-9",
    name: "Mail Gateway MX-01",
    ip: "192.168.20.15",
    mac: "00:AB:BC:CD:DE:EF",
    hostname: "srv-mail-mx.netverse.local",
    vendor: "Dell EMC",
    type: DeviceType.SERVER,
    status: DeviceStatus.ONLINE,
    latency: 5,
    packetLoss: 0.0,
    lastSeen: "15:35:56",
    bandwidthIn: 120,
    bandwidthOut: 150,
    cpuUsage: 18,
    memoryUsage: 44,
    connections: ["dev-4"]
  },
  {
    id: "dev-10",
    name: "Corporate WiFi AP-01",
    ip: "192.168.20.20",
    mac: "00:BC:CD:DE:EF:F0",
    hostname: "ap-office-01.netverse.local",
    vendor: "Ubiquiti Networks",
    type: DeviceType.ACCESS_POINT,
    status: DeviceStatus.ONLINE,
    latency: 8,
    packetLoss: 0.2,
    lastSeen: "15:35:53",
    bandwidthIn: 160,
    bandwidthOut: 110,
    cpuUsage: 35,
    memoryUsage: 49,
    connections: ["dev-4"]
  },
  {
    id: "dev-11",
    name: "Guest AP-02",
    ip: "192.168.20.21",
    mac: "00:CD:DE:EF:F0:F1",
    hostname: "ap-guest-02.netverse.local",
    vendor: "Ubiquiti Networks",
    type: DeviceType.ACCESS_POINT,
    status: DeviceStatus.ONLINE,
    latency: 12,
    packetLoss: 0.4,
    lastSeen: "15:35:51",
    bandwidthIn: 95,
    bandwidthOut: 55,
    cpuUsage: 24,
    memoryUsage: 32,
    connections: ["dev-4"]
  },
  {
    id: "dev-12",
    name: "NOC Workstation",
    ip: "192.168.20.5",
    mac: "00:DE:EF:F0:F1:F2",
    hostname: "host-noc-client.netverse.local",
    vendor: "HP Enterprise",
    type: DeviceType.WORKSTATION,
    status: DeviceStatus.ONLINE,
    latency: 6,
    packetLoss: 0.0,
    lastSeen: "15:35:57",
    bandwidthIn: 55,
    bandwidthOut: 18,
    cpuUsage: 11,
    memoryUsage: 19,
    connections: ["dev-4"]
  }
];

// Pre-configured alarms
const INITIAL_ALERTS: NetworkAlert[] = [
  {
    id: "alt-0",
    severity: AlertSeverity.CRITICAL,
    message: "Potential Command and Control (C2) threat detected outbound on Core Switch CS-01 to unrecognized external host 45.132.8.22",
    timestamp: "15:12:05",
    deviceName: "Core Switch CS-01",
    status: AlertStatus.ACTIVE,
    category: "SECURITY"
  },
  {
    id: "alt-1",
    severity: AlertSeverity.HIGH,
    message: "Access Switch AS-02 latency threshold limit saturated (latency peak: 142ms, packet loss: 1.4%)",
    timestamp: "15:18:22",
    deviceName: "Access Switch AS-02",
    status: AlertStatus.ACTIVE,
    category: "PERFORMANCE"
  },
  {
    id: "alt-2",
    severity: AlertSeverity.MEDIUM,
    message: "Department printer PRN-OFFICE-01 offline state identified. Subsystem snmp-polling timeout limit exceeded.",
    timestamp: "08:12:14",
    deviceName: "PRN-OFFICE-01",
    status: AlertStatus.ACTIVE,
    category: "HARDWARE"
  }
];

// Preloaded syslogs
const INITIAL_LOGS: NetworkLog[] = [
  {
    id: "log-0",
    timestamp: "15:34:10",
    deviceName: "Core Router CR-01",
    event: "SNMP TRAP: OSPF routing database synchronized successfully with peer ID 10.0.0.1",
    severity: "INFO",
    status: "SUCCESS",
    category: "SNMP Traps"
  },
  {
    id: "log-1",
    timestamp: "15:31:05",
    deviceName: "WAN Gateway",
    event: "SECURITY: Firewall denied incoming ICMP request from IP 185.122.45.92 on Port 0",
    severity: AlertSeverity.LOW,
    status: "FAILED",
    category: "Security Daemon"
  },
  {
    id: "log-2",
    timestamp: "15:28:14",
    deviceName: "Core Switch CS-01",
    event: "SYS: Core trunk interface GigEthernet0/1 VLAN-10 port state transitioned to FORWARDING",
    severity: "INFO",
    status: "SUCCESS",
    category: "Link Layer"
  },
  {
    id: "log-3",
    timestamp: "15:22:40",
    deviceName: "Mail Gateway MX-01",
    event: "SNMP TRAP: Mail exchange SMTP delivery queue buffer flushed cleanly, 142 items delivered.",
    severity: "INFO",
    status: "SUCCESS",
    category: "SNMP Traps"
  }
];

interface ToastMessage {
  id: string;
  type: "info" | "success" | "warn" | "error";
  title: string;
  text: string;
}

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core network platform datasets
  const [devices, setDevices] = useState<NetworkDevice[]>(INITIAL_DEVICES);
  const [alerts, setAlerts] = useState<NetworkAlert[]>(INITIAL_ALERTS);
  const [logs, setLogs] = useState<NetworkLog[]>(INITIAL_LOGS);
  
  // Custom Toasts and Notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; time: string; read: boolean }>>([
    { id: "not-0", text: "Critical Security Alarm triggered on Core Switch CS-01.", time: "15:12", read: false },
    { id: "not-1", text: "Performance alarm threshold reached on AS-02 switch.", time: "15:18", read: false },
    { id: "not-2", text: "Department printer went offline.", time: "08:12", read: true }
  ]);

  // Handle active dark/light mode toggle
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLoginSuccess = (operator: { name: string; email: string; role: string }) => {
    setUser(operator);
    triggerToast("success", "Terminal Synchronization Complete", `Operator session authorized for ${operator.name}.`);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("dashboard");
  };

  // Helper to append dynamic toasts
  const triggerToast = (type: "info" | "success" | "warn" | "error", title: string, text: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Trigger SNMP actions / remediations and add system logs
  const handleTriggerAction = (actionName: string, targetName: string) => {
    triggerToast("success", "SNMP Action Transmitted", `Command: [${actionName}] targeted at @${targetName} executed.`);
    
    // Append a new success syslog log
    const newLog: NetworkLog = {
      id: `log-act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      deviceName: targetName,
      event: `CLI ACTION: Operator executed command '${actionName}' successfully over Snmpv3.`,
      severity: "INFO",
      status: "SUCCESS",
      category: "System Monitor"
    };

    setLogs((prev) => [newLog, ...prev]);

    // If rebooting AS-02 switch or PRN-OFFICE-01, recover their statuses!
    if (actionName.includes("Reboot") || actionName.includes("Resolve") || actionName.includes("Enable Loop Guard") || actionName.includes("Block")) {
      setTimeout(() => {
        if (targetName.includes("AS-02")) {
          // Recover AS-02 latency
          setDevices(prev => prev.map(d => d.id === "dev-4" ? { ...d, status: DeviceStatus.ONLINE, latency: 6, packetLoss: 0.0 } : d));
          setAlerts(prev => prev.map(a => a.deviceId === "dev-4" || a.deviceName.includes("AS-02") ? { ...a, status: AlertStatus.RESOLVED } : a));
          triggerToast("success", "Subsystem Recovered", "Access Switch AS-02 telemetry stabilized. Latency back to baseline (6ms).");
        } else if (targetName.includes("PRN-OFFICE-01") || actionName.includes("Wakeup") || actionName.includes("Printer")) {
          // Recover printer
          setDevices(prev => prev.map(d => d.id === "dev-8" ? { ...d, status: DeviceStatus.ONLINE, latency: 14, packetLoss: 0.0, cpuUsage: 2, memoryUsage: 12 } : d));
          setAlerts(prev => prev.map(a => a.deviceName.includes("PRN-OFFICE-01") ? { ...a, status: AlertStatus.RESOLVED } : a));
          triggerToast("success", "Hardware Link Restored", "PRN-OFFICE-01 resolved offline state. Heartbeat link OK.");
        } else if (targetName.includes("CS-01") || actionName.includes("Block")) {
          // Resolve security threat
          setAlerts(prev => prev.map(a => a.deviceName.includes("CS-01") ? { ...a, status: AlertStatus.RESOLVED } : a));
          triggerToast("success", "Threat Contained", "Emergency egress firewalls synchronized. Outbound target blocked.");
        }
      }, 3000);
    }
  };

  // Add a newly provisioned mock device
  const handleAddMockDevice = () => {
    const nextId = `dev-mock-${Date.now()}`;
    const nextIP = `192.168.10.${100 + Math.floor(Math.random() * 100)}`;
    
    const newDev: NetworkDevice = {
      id: nextId,
      name: `WORKSTATION-AP-${Math.floor(Math.random() * 100)}`,
      ip: nextIP,
      mac: `00:E1:D2:C3:B4:A5`,
      hostname: `host-prov-${Math.floor(Math.random() * 100)}.netverse.local`,
      vendor: "HP Enterprise",
      type: DeviceType.WORKSTATION,
      status: DeviceStatus.ONLINE,
      latency: 5 + Math.floor(Math.random() * 10),
      packetLoss: 0.0,
      lastSeen: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bandwidthIn: 12 + Math.floor(Math.random() * 40),
      bandwidthOut: 8 + Math.floor(Math.random() * 20),
      cpuUsage: 10 + Math.floor(Math.random() * 15),
      memoryUsage: 15 + Math.floor(Math.random() * 20),
      connections: ["dev-3"]
    };

    setDevices((prev) => [...prev, newDev]);
    triggerToast("success", "Hardware Asset Provisioned", `Host @${newDev.name} registered on interface Subnet 10.`);
    
    // Add log
    setLogs((prev) => [
      {
        id: `log-prov-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        deviceName: newDev.name,
        event: `DHCP: Assigned lease IP ${newDev.ip} to MAC address ${newDev.mac} under Lease Class VLAN-10`,
        severity: "INFO",
        status: "SUCCESS",
        category: "System Monitor"
      },
      ...prev
    ]);
  };

  // Delete/De-provision device
  const handleDeleteDevice = (deviceId: string) => {
    const dev = devices.find(d => d.id === deviceId);
    if (!dev) return;
    setDevices((prev) => prev.filter(d => d.id !== deviceId));
    triggerToast("info", "Asset De-provisioned", `Host @${dev.name} interface link terminated.`);
  };

  // Acknowledge alert
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: AlertStatus.ACKNOWLEDGED } : a))
    );
    triggerToast("info", "Alarm Acknowledged", "SNMP warning acknowledged. Incident ticket updated.");
  };

  // Resolve Alert
  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: AlertStatus.RESOLVED } : a))
    );
    triggerToast("success", "Alarm Resolved", "Alert cleared from network stack.");
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Periodically fluctuate telemetry metrics by +/- 2% to make the dashboard charts feel alive!
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((dev) => {
          if (dev.status === DeviceStatus.OFFLINE) return dev;
          
          // Random fluctuations
          const latencyDrift = Math.random() > 0.5 ? 1 : -1;
          const cpuDrift = Math.random() > 0.5 ? 2 : -2;
          const rxDrift = Math.random() > 0.5 ? 10 : -10;

          return {
            ...dev,
            latency: Math.max(1, dev.latency + latencyDrift),
            cpuUsage: Math.min(99, Math.max(5, dev.cpuUsage + cpuDrift)),
            bandwidthIn: Math.max(10, dev.bandwidthIn + rxDrift)
          };
        })
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Main navigation tab director
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            devices={devices}
            alerts={alerts}
            logs={logs}
            onSetTab={setActiveTab}
            onTriggerAction={handleTriggerAction}
          />
        );
      case "devices":
        return (
          <DeviceTable
            devices={devices}
            onTriggerAction={handleTriggerAction}
            onDeleteDevice={handleDeleteDevice}
            onAddMockDevice={handleAddMockDevice}
          />
        );
      case "topology":
        return <TopologyMap devices={devices} onTriggerAction={handleTriggerAction} />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "alerts":
        return (
          <AlertCenter
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            onTriggerAction={handleTriggerAction}
          />
        );
      case "logs":
        return <LogViewer logs={logs} />;
      case "reports":
        return <ReportsGenerator onTriggerAction={handleTriggerAction} />;
      case "assistant":
        return <ChatBot onTriggerAction={handleTriggerAction} />;
      case "settings":
        return <SettingsPanel onTriggerAction={handleTriggerAction} />;
      default:
        return (
          <DashboardView
            devices={devices}
            alerts={alerts}
            logs={logs}
            onSetTab={setActiveTab}
            onTriggerAction={handleTriggerAction}
          />
        );
    }
  };

  // If user is not authenticated, show the login gateway screen
  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`min-h-screen font-sans flex text-[#cbd5e1] select-none ${isDark ? "bg-[#090d16]" : "bg-[#f8fafc] text-[#334155]"}`}>
      
      {/* Toast Alert stack overlay */}
      <div className="fixed top-5 right-5 z-50 space-y-3 pointer-events-none w-80">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-auto w-full bg-[#0f172a]/95 border border-[#1e293b] rounded-2xl p-4 shadow-2xl relative flex gap-3 overflow-hidden backdrop-blur-md"
            >
              {/* Colored status line indicators */}
              <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                toast.type === "success" ? "bg-emerald-500" : toast.type === "error" ? "bg-red-500" : "bg-cyan-500"
              }`} />
              
              <div className="shrink-0 text-cyan-400 mt-0.5">
                {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <h5 className="text-xs font-bold text-white tracking-wide">{toast.title}</h5>
                <p className="text-[10.5px] text-[#94a3b8] mt-1 leading-normal font-sans">{toast.text}</p>
              </div>

              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-[#475569] hover:text-white shrink-0 self-start transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Shared Collapsible Sidebar */}
      <Sidebar
        currentTab={activeTab}
        setTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        user={user}
        onLogout={handleLogout}
        activeAlertsCount={alerts.filter(a => a.status === AlertStatus.ACTIVE).length}
      />

      {/* Main Viewport Content block */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top shared navigation */}
        <Navbar
          currentTab={activeTab}
          isDark={isDark}
          toggleTheme={toggleTheme}
          user={user}
          notifications={notifications}
          markNotificationsAsRead={handleMarkNotificationsRead}
          onLogout={handleLogout}
        />

        {/* Inner View Scroll container */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}

// Inline fallback icons for toast
function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
