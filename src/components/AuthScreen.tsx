/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Eye, EyeOff, Lock, User, RefreshCw, KeyRound, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthScreenProps {
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("admin@netverse.com");
  const [password, setPassword] = useState("admin");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    setTimeout(() => {
      if (mode === "login") {
        if (email === "admin@netverse.com" && password === "admin") {
          onLoginSuccess({
            name: "NOC Operator Alpha",
            email: "admin@netverse.com",
            role: "Senior Security Administrator"
          });
        } else {
          setError("Invalid credentials. Try admin@netverse.com / admin");
          setLoading(false);
        }
      } else if (mode === "register") {
        if (!email || !password || !name) {
          setError("Please fill in all fields.");
          setLoading(false);
          return;
        }
        setSuccessMsg("Registration request transmitted to Secure Domain Controller. Approval pending.");
        setMode("login");
        setLoading(false);
      } else {
        if (!email) {
          setError("Please specify account email address.");
          setLoading(false);
          return;
        }
        setSuccessMsg("One-time security recovery token dispatched to external mail exchange server.");
        setMode("login");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div id="auth-container" className="min-h-screen bg-[#090d16] text-[#e2e8f0] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans select-none">
      {/* Decorative Network Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      
      {/* Laser scan effect */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/50 shadow-[0_0_15px_#06b6d4] animate-[bounce_8s_infinite] pointer-events-none" />

      {/* Futuristic Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        id="auth-card"
        className="w-full max-w-md bg-[#0f172a]/95 border border-[#1e293b] rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.15)] relative z-10"
      >
        {/* Neon corner accents */}
        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg" />
        <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-cyan-500 rounded-tr-lg" />
        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-cyan-500 rounded-bl-lg" />
        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-cyan-500 rounded-br-lg" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-4 relative shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Shield className="w-8 h-8 text-cyan-400" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-lg opacity-40 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold font-sans tracking-wider bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            NETVERSE
          </h1>
          <p className="text-xs text-[#64748b] mt-1 uppercase tracking-widest font-mono">
            AI-Powered Operations Command
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== "forgot" && (
          <div className="grid grid-cols-2 bg-[#1e293b]/50 border border-[#334155]/60 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(null); }}
              className={`py-2 text-xs font-medium rounded-lg transition-all duration-300 ${
                mode === "login"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/15"
                  : "text-[#94a3b8] hover:text-[#f8fafc]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("register"); setError(null); }}
              className={`py-2 text-xs font-medium rounded-lg transition-all duration-300 ${
                mode === "register"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/15"
                  : "text-[#94a3b8] hover:text-[#f8fafc]"
              }`}
            >
              Request Access
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-2.5 text-xs text-red-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 flex items-center gap-2.5 text-xs text-emerald-400">
                <Shield className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5 font-mono">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all text-white placeholder-[#475569]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5 font-mono">
                  Operator Identity (Email)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                  <input
                    type="email"
                    required
                    placeholder="operator@netverse.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all text-white placeholder-[#475569]"
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider font-mono">
                      Security Passcode
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-all"
                      >
                        Reset Key
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#0f172a] border border-[#334155] rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all text-white placeholder-[#475569]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94a3b8] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synchronizing Terminals...</span>
                  </>
                ) : mode === "login" ? (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Authenticate Operator</span>
                  </>
                ) : mode === "register" ? (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Request Credentials</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Authorize Key Reset</span>
                  </>
                )}
              </button>

              {mode === "forgot" && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setError(null); }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-all"
                  >
                    Back to Terminal Authentication
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </AnimatePresence>

        {/* Demo Credentials Helper */}
        {mode === "login" && (
          <div className="mt-8 border-t border-[#1e293b] pt-4 text-center">
            <p className="text-[10px] text-[#475569] font-mono leading-relaxed uppercase">
              Sandbox Console Identity: <br />
              <span className="text-cyan-500">admin@netverse.com</span> / <span className="text-cyan-500">admin</span>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
