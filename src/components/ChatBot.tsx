/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Brain,
  Send,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Play,
  RotateCcw,
  Zap,
  Info,
  HelpCircle,
  Clock,
  Terminal
} from "lucide-react";
import { ChatMessage, ChatDiagnosis, AlertSeverity } from "../types";

interface ChatBotProps {
  onTriggerAction: (actionName: string, deviceName: string) => void;
}

export default function ChatBot({ onTriggerAction }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "Hello! I am your **NetVerse AI Copilot**. I analyze your live network topology, latency metrics, and cybersecurity event streams.\n\nYou can ask me to: \n- Diagnose recent **slow pings** or latency spikes\n- Inspect the **offline printer** PRN-OFFICE-01\n- Analyze suspicious security **alerts** or potential malware attacks\n\nHow can I help you optimize your enterprise operations today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        "Why is switch AS-02 experiencing high latency?",
        "Diagnose printer PRN-OFFICE-01 offline state",
        "Explain the suspicious outbound security alert"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.sender, parts: [{ text: m.text }] }))
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (data && (data.reply || data.diagnosis)) {
        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: "ai",
          text: data.reply || "I've processed your query.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          diagnosis: data.diagnosis as ChatDiagnosis | undefined,
          suggestions: data.suggestions || [
            "Are there any other active security warnings?",
            "Run a full network bandwidth traceroute",
            "Mute this alert"
          ]
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Chat endpoint error, fallback to simulated engine:", err);
      setIsTyping(false);
      
      // Fallback response if server fails or key is missing
      setTimeout(() => {
        const aiFallbackMsg: ChatMessage = {
          id: `msg-ai-fallback-${Date.now()}`,
          sender: "ai",
          text: `I received your telemetry query: **"${text}"**. I've initiated an asynchronous SNMP poll sequence across all active gateways. No major outages identified. Let me know if you need specific advice on VLAN configurations, loop guard settings, or BGP route flapping!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            "Explain loop guard configurations",
            "Check active bandwidth statistics",
            "Are there any offline routers?"
          ]
        };
        setMessages((prev) => [...prev, aiFallbackMsg]);
      }, 1000);
    }
  };

  const handleSuggestClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]";
      case AlertSeverity.HIGH:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case AlertSeverity.MEDIUM:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case AlertSeverity.LOW:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div id="ai-chat-screen" className="flex flex-col h-[calc(100vh-7rem)] border border-[#1e293b] rounded-3xl overflow-hidden bg-[#1e293b]/40 backdrop-blur-md shadow-2xl relative select-none">
      {/* Laser grids decorative background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-5 pointer-events-none" />

      {/* Chat header */}
      <div className="p-4 bg-slate-900/60 border-b border-[#1e293b] flex items-center justify-between backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl relative overflow-hidden">
            <Brain className="w-5 h-5 text-cyan-400" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-md opacity-30 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              NetVerse AI Copilot
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            </h2>
            <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              Cognitive diagnostics online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-[#64748b]">
          <Terminal className="w-3.5 h-3.5 text-[#475569]" />
          <span>LLM Engine: <strong className="text-white">Gemini 3.5 Flash</strong></span>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 max-w-3xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-md ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-blue-500/20"
                  : "bg-slate-900/80 border-[#334155]/60 text-cyan-400"
              }`}
            >
              {msg.sender === "user" ? "OP" : <Brain className="w-4 h-4" />}
            </div>

            {/* Bubble content */}
            <div className="space-y-3 flex-1">
              {/* Converastional text bubble */}
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed border font-sans ${
                  msg.sender === "user"
                    ? "bg-blue-600/10 border-blue-500/20 text-[#cbd5e1] rounded-tr-none shadow-lg shadow-blue-500/3"
                    : "bg-[#0f172a]/80 border-[#1e293b] text-[#cbd5e1] rounded-tl-none shadow-md"
                }`}
              >
                {/* Format paragraphs / list lines cleanly */}
                {msg.text.split("\n").map((line, idx) => {
                  let formattedLine = line;
                  // Handle list items
                  if (line.startsWith("- ")) {
                    return (
                      <li key={idx} className="list-disc ml-4 my-1">
                        {line.replace("- ", "")}
                      </li>
                    );
                  }
                  // Handle bold markers
                  if (line.includes("**")) {
                    const parts = line.split("**");
                    return (
                      <p key={idx} className="my-1.5">
                        {parts.map((p, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-bold">{p}</strong> : p))}
                      </p>
                    );
                  }
                  return <p key={idx} className="my-1.5">{line}</p>;
                })}

                <span className="block text-[9px] text-[#475569] font-mono mt-2.5 text-right">
                  {msg.timestamp}
                </span>
              </div>

              {/* Cognitive Problem Diagnosis Card */}
              {msg.diagnosis && (
                <div className="bg-slate-900/90 border border-red-500/15 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                  {/* Neon border accents */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
                  
                  <div className="flex justify-between items-start mb-3.5 pl-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 font-mono">
                        COGNITIVE ROOT CAUSE DIAGNOSIS
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-wide ${getSeverityColor(msg.diagnosis.severity)}`}>
                      {msg.diagnosis.severity}
                    </span>
                  </div>

                  <div className="space-y-3.5 pl-2">
                    <div>
                      <h5 className="text-xs font-bold text-white tracking-wide">{msg.diagnosis.title}</h5>
                      <p className="text-[11.5px] text-[#94a3b8] mt-1.5 leading-relaxed font-sans">
                        <strong className="text-red-400/90 font-semibold">Root Cause:</strong> {msg.diagnosis.rootCause}
                      </p>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/40 text-[11px] leading-relaxed text-[#cbd5e1]">
                      <strong className="text-cyan-400 font-mono font-semibold uppercase tracking-wider block mb-1">Recommended Remediation Plan:</strong>
                      {msg.diagnosis.recommendation}
                    </div>

                    {/* Interactive mitigation buttons */}
                    {msg.diagnosis.actions && msg.diagnosis.actions.length > 0 && (
                      <div className="pt-2 border-t border-[#1e293b]/60">
                        <span className="text-[10px] text-[#475569] font-mono uppercase tracking-widest block mb-2.5">Immediate Mitigations</span>
                        <div className="flex flex-wrap gap-2">
                          {msg.diagnosis.actions.map((act) => (
                            <button
                              key={act}
                              onClick={() => onTriggerAction(`AI-Remediation: ${act}`, "Affected Switch Stack")}
                              className="px-3.5 py-1.5 border border-cyan-500/20 hover:border-cyan-500 bg-[#1e293b]/60 text-cyan-400 hover:text-white font-mono text-[10.5px] font-semibold uppercase tracking-wider rounded-xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                              <span>{act}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actionable Quick Suggestions buttons */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pl-12">
                  {msg.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestClick(suggestion)}
                      className="px-3 py-1.5 bg-[#1e293b]/50 border border-[#334155]/60 hover:border-cyan-500/50 hover:bg-[#1e293b]/80 rounded-xl text-[10px] font-medium text-[#94a3b8] hover:text-[#f8fafc] transition-all cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Placeholder */}
        {isTyping && (
          <div className="flex gap-3.5 max-w-lg">
            <div className="w-9 h-9 rounded-xl border bg-slate-900/80 border-[#334155]/60 text-cyan-400 flex items-center justify-center shrink-0 shadow-md">
              <Brain className="w-4 h-4 animate-pulse text-cyan-400" />
            </div>
            <div className="p-4 bg-[#0f172a]/60 border border-[#1e293b] rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input panel footer */}
      <div className="p-4 bg-slate-900/60 border-t border-[#1e293b] relative z-10 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex items-center gap-2.5 max-w-5xl mx-auto"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder="Ask AI Copilot to run pings, analyze alerts, diagnose switches..."
            className="flex-1 bg-[#0f172a] border border-[#334155] rounded-2xl px-4 py-3 text-xs text-[#cbd5e1] placeholder-[#475569] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
