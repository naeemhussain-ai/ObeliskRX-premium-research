import { useState } from "react";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useAuth, AUTH_API } from "@/lib/auth";
import { Link, navigateTo } from "@/lib/router";

type Tab = "login" | "register";

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary pr-10"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState<Tab>("login");

  // Login form state
  const [lEmail, setLEmail]     = useState("");
  const [lPassword, setLPassword] = useState("");

  // Register form state
  const [rName, setRName]         = useState("");
  const [rEmail, setREmail]       = useState("");
  const [rPassword, setRPassword] = useState("");
  const [rConfirm, setRConfirm]   = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${AUTH_API}/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lEmail, password: lPassword }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.data.token, data.data.customer);
        navigateTo("/account");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rPassword !== rConfirm) { setError("Passwords do not match."); return; }
    if (rPassword.length < 8)   { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${AUTH_API}/auth/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: rName, email: rEmail, password: rPassword }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.data.token, data.data.customer);
        navigateTo("/account");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        {/* Tab Toggle */}
        <div className="mb-8 flex rounded-xl border border-border bg-card p-1 shadow-card">
          {(["login", "register"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                tab === t
                  ? "bg-[#0B1F3A] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          {tab === "login" ? (
            <>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-[#0B1F3A]/10 text-[#0B1F3A]">
                  <LogIn size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Welcome back</h1>
                  <p className="text-xs text-muted-foreground">Sign in to your ObeliskRX account</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <InputField label="Email" type="email" value={lEmail} onChange={setLEmail} placeholder="you@example.com" required />
                <InputField label="Password" type="password" value={lPassword} onChange={setLPassword} placeholder="••••••••" required />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#0B1F3A] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0d1631] hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                No account?{" "}
                <button type="button" onClick={() => setTab("register")} className="font-semibold text-primary hover:underline">
                  Create one
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-[#0B1F3A]/10 text-[#0B1F3A]">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Create account</h1>
                  <p className="text-xs text-muted-foreground">Track orders, save wishlist & more</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <InputField label="Full Name" value={rName} onChange={setRName} placeholder="John Doe" required />
                <InputField label="Email" type="email" value={rEmail} onChange={setREmail} placeholder="you@example.com" required />
                <InputField label="Password" type="password" value={rPassword} onChange={setRPassword} placeholder="Min. 8 characters" required />
                <InputField label="Confirm Password" type="password" value={rConfirm} onChange={setRConfirm} placeholder="Repeat password" required />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#0B1F3A] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0d1631] hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button type="button" onClick={() => setTab("login")} className="font-semibold text-primary hover:underline">
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Want to order without an account?{" "}
          <Link to="/cart" className="font-semibold text-primary hover:underline">
            Continue as Guest ←’
          </Link>
        </p>
      </div>
    </div>
  );
}


