/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DeviceStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  MAINTENANCE = "MAINTENANCE",
  WARNING = "WARNING"
}

export enum DeviceType {
  ROUTER = "ROUTER",
  SWITCH = "SWITCH",
  SERVER = "SERVER",
  WORKSTATION = "WORKSTATION",
  PRINTER = "PRINTER",
  ACCESS_POINT = "ACCESS_POINT",
  GATEWAY = "GATEWAY"
}

export enum AlertSeverity {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}

export enum AlertStatus {
  ACTIVE = "ACTIVE",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  RESOLVED = "RESOLVED"
}

export interface NetworkDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  hostname: string;
  vendor: string;
  type: DeviceType;
  status: DeviceStatus;
  latency: number; // in ms
  packetLoss: number; // percentage
  lastSeen: string;
  bandwidthIn: number; // in Mbps
  bandwidthOut: number; // in Mbps
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  connections: string[]; // ids of other connected devices
}

export interface NetworkAlert {
  id: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  deviceId?: string;
  deviceName: string;
  status: AlertStatus;
  category: "SECURITY" | "PERFORMANCE" | "HARDWARE" | "SYSTEM";
}

export interface NetworkLog {
  id: string;
  timestamp: string;
  deviceName: string;
  event: string;
  severity: AlertSeverity | "INFO";
  status: "SUCCESS" | "FAILED" | "PENDING" | "INFO";
  category: string;
}

export interface ChatDiagnosis {
  title: string;
  severity: AlertSeverity;
  probability: number; // percentage
  rootCause: string;
  recommendation: string;
  actions: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestions?: string[];
  diagnosis?: ChatDiagnosis;
}

export interface NetworkTopologyNode {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  ip: string;
  x: number;
  y: number;
}

export interface NetworkTopologyEdge {
  id: string;
  source: string;
  target: string;
  active: boolean;
  bandwidth: number; // Mbps
}
