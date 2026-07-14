/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to avoid crashes if API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
      return null;
    }
  }
  return aiClient;
}

// System Instruction for Network Administrator AI
const SYSTEM_INSTRUCTION = `You are NetVerse AI Copilot, an elite Senior Network Operations Center (NOC) Engineer and Cyber Security Analyst.
Your goal is to help network administrators monitor, diagnose, and optimize their NetVerse network environment.

When the user describes an issue, you must diagnose it and provide:
1. An expert explanation of the symptoms and possible vectors.
2. A structured diagnosis with:
   - title (short description of the issue, e.g., "DHCP IP Pool Exhaustion")
   - severity (CRITICAL, HIGH, MEDIUM, LOW)
   - probability (0-100 percentage)
   - rootCause (what's causing it)
   - recommendation (step-by-step resolution)
   - actions (a list of 2-3 immediate mitigation buttons/actions, e.g., "Reboot Switch", "Flush DHCP Lease", "Isolate Subnet")

You MUST respond in JSON format matching this schema:
{
  "reply": "Your conversational markdown reply explaining the diagnosis and insights...",
  "diagnosis": {
    "title": "DHCP IP Pool Exhaustion",
    "severity": "HIGH",
    "probability": 85,
    "rootCause": "The /24 subnet has run out of assignable IP addresses due to an influx of guest IoT devices.",
    "recommendation": "Expand the lease pool scope or reduce lease duration from 24h to 2h.",
    "actions": ["Flush DHCP Leases", "Expand Scope /23", "Isolate Guest VLAN"]
  }
}

If the user is asking a general network question or greeting you (where no specific problem diagnosis is required), return:
{
  "reply": "Your conversational markdown reply answering their question..."
}

Always keep your tone professional, authoritative, and helpful. Use technical terms like TCP/IP, VLAN, packet loss, OSPF, BGP, ARP spoofing, latency jitter, and DNS recursive lookups appropriately.`;

// Pre-defined rule-based answers when Gemini API Key is not set or fails
const RULE_BASED_ANSWERS: Array<{ keywords: string[]; response: any }> = [
  {
    keywords: ["latency", "slow", "ping", "lag"],
    response: {
      reply: "I've detected anomalous latency jitter on Access Switch **AS-02** affecting VLAN 10. The round-trip time (RTT) has increased from a baseline of **4ms** to **142ms** over the last 15 minutes.\n\nThis appears to be caused by high broadcast traffic volume or a potential routing loop.",
      diagnosis: {
        title: "Access Switch Jitter & Broadcast Storm",
        severity: "HIGH",
        probability: 90,
        rootCause: "A physical loop has been introduced on Ports 12 and 14 of AS-02, triggering a broadcast storm.",
        recommendation: "Enable Spanning Tree Protocol (STP) on all access ports, or physically trace and remove the redundant link.",
        actions: ["Enable Loop Guard", "Isolate Port 12", "Restart AS-02 Switch"]
      }
    }
  },
  {
    keywords: ["offline", "down", "disconnected", "printer"],
    response: {
      reply: "The main department printer **PRN-OFFICE-01** (IP: 192.168.1.150) went offline at 08:12 UTC. This was preceded by successive SNMP timeout events. The switch port is showing a physical link status of 'Down'.",
      diagnosis: {
        title: "Printer Network Interface Offline",
        severity: "MEDIUM",
        probability: 95,
        rootCause: "The network cable has been unplugged, or the printer's internal network interface card (NIC) has entered an unresponsive power-saving state.",
        recommendation: "Confirm the ethernet link light is active on Access Switch AS-01 Port 8. Restart the printer network module.",
        actions: ["Bounce Switch Port 8", "Send SNMP Wakeup", "Trigger ICMP Scan Request"]
      }
    }
  },
  {
    keywords: ["security", "hack", "ddos", "alert", "attack", "malware"],
    response: {
      reply: "A severe warning alert indicates anomalous traffic patterns on Core Switch **CS-01** outbound to an unrecognized external IP address (45.132.8.22). This matches threat intelligence signatures for known command-and-control (C2) servers.\n\nI recommend immediate isolation of the source host **SRV-DB-PROD** (IP: 192.168.10.45).",
      diagnosis: {
        title: "Suspicious Outbound C2 Traffic Identified",
        severity: "CRITICAL",
        probability: 98,
        rootCause: "A compromised server is communicating over unauthorized port 4433 to a suspicious external host.",
        recommendation: "Deploy an emergency firewall block on port 4433 outbound and isolate the affected virtual machine.",
        actions: ["Block Dest IP 45.132.8.22", "Quarantine SRV-DB-PROD", "Force Firewall Sync"]
      }
    }
  },
  {
    keywords: ["cpu", "spike", "memory", "usage"],
    response: {
      reply: "Core Router **CR-01** is experiencing a CPU core saturation spike of **94%** (normal baseline is 15-22%). SNMP telemetry indicates a massive influx of BGP routing table updates or active packet inspection overhead.",
      diagnosis: {
        title: "Core Router CPU Core Saturation",
        severity: "HIGH",
        probability: 88,
        rootCause: "Severe route flapping in the exterior gateway peer has flooded the BGP RIB, forcing excessive CPU reconvergence.",
        recommendation: "Implement route dampening on peer BGP sessions and clear flapping flap statistics.",
        actions: ["Clear Flapping BGP Sessions", "Deploy BGP Route Dampening", "Allocate Spare Core"]
      }
    }
  }
];

const DEFAULT_AI_RESPONSE = {
  reply: "Hello! I am your **NetVerse AI Copilot**. I am connected directly to your network topology and log streams.\n\nYou can ask me to:\n- Diagnose recent **latency spikes** on your switches\n- Analyze suspicious security **alerts** or potential attacks\n- Troubleshoot **offline printers** or servers\n- Provide advice on optimizing Spanning Tree Protocol (STP) or BGP configs.\n\nHow can I help you optimize your enterprise infrastructure today?"
};

// API Route: AI Network Copilot Chat
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Missing message parameter." });
    return;
  }

  const normalizedMessage = message.toLowerCase().trim();

  // Try to use real Gemini API if client is available
  const ai = getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Previous Conversation History:\n${JSON.stringify(history || [])}\n\nUser Question:\n${message}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText.trim());
          res.json(parsed);
          return;
        } catch (jsonErr) {
          console.error("Gemini returned invalid JSON structure, falling back to clean text wrapper:", responseText);
          res.json({
            reply: responseText,
          });
          return;
        }
      }
    } catch (apiErr) {
      console.error("Gemini API execution failed, falling back to rules:", apiErr);
    }
  }

  // Fallback to rule-based interactive response
  let matchedResponse = null;
  for (const item of RULE_BASED_ANSWERS) {
    if (item.keywords.some((kw) => normalizedMessage.includes(kw))) {
      matchedResponse = item.response;
      break;
    }
  }

  if (matchedResponse) {
    res.json(matchedResponse);
  } else {
    // Return friendly generic response
    res.json({
      reply: `I received your query: "${message}". Currently, I'm monitoring the NetVerse platform. You can ask me to look into **latency**, **offline devices**, or **security alerts** to trigger a fully structured AI root-cause diagnosis, or let me know if you have specific setup questions!`,
      suggestions: [
        "Why is switch AS-02 experiencing high latency?",
        "Diagnose printer PRN-OFFICE-01 offline state",
        "Explain the suspicious outbound security alert"
      ]
    });
  }
});

// Start express with Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NetVerse Server] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
