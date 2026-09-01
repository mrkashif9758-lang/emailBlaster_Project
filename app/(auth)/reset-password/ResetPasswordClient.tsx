"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";



import { Lock, ArrowRight, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Password reset failed");
      }

      setSuccess("Password updated successfully");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        {/* Header Branding / Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 ring-4 ring-blue-500/10">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Set new password
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Your new password must be different from previous used passwords.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 text-sm transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 text-sm transition-all outline-none"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating password...</span>
              </>
            ) : (
              <>
                <span>Update password</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}