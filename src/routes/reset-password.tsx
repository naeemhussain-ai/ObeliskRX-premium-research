import { useState } from "react";
import { CheckCircle2, KeyRound, XCircle } from "lucide-react";
import { AUTH_API } from "@/lib/auth";
import { Link } from "@/lib/router";

export function ResetPasswordPage() {
  const token = new URLSearchParams(window.location.search).get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [expired, setExpired] = useState(!token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${AUTH_API}/auth/reset-password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
      } else if (data.errors?.code === "TOKEN_INVALID") {
        setExpired(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary";

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card">
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto text-emerald-500" size={48} />
            <h1 className="mt-6 text-xl font-bold">Password updated</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your password has been changed. You can now sign in with your new password.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block w-full rounded-full bg-[#0B1F3A] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0d1631]"
            >
              Go to Sign In
            </Link>
          </div>
        ) : expired ? (
          <div className="text-center">
            <XCircle className="mx-auto text-red-500" size={48} />
            <h1 className="mt-6 text-xl font-bold">Link expired</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This password reset link is invalid or has expired. Reset links work for 1 hour and can only be used once.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block w-full rounded-full bg-[#0B1F3A] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0d1631]"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-[#0B1F3A]/10 text-[#0B1F3A]">
                <KeyRound size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Choose a new password</h1>
                <p className="text-xs text-muted-foreground">Use at least 8 characters</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" required autoComplete="new-password" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password" required autoComplete="new-password" className={inputClass} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#0B1F3A] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0d1631] hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? "Saving…" : "Save new password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
