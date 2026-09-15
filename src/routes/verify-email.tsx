import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAuth, AUTH_API } from "@/lib/auth";
import { Link, navigateTo } from "@/lib/router";

type Status = "verifying" | "success" | "error";

export function VerifyEmailPage() {
  const { login } = useAuth();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("Verifying your email…");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    fetch(`${AUTH_API}/auth/verify-email.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          login(data.data.token, data.data.customer);
          setStatus("success");
          setMessage("Your email has been verified! Redirecting to your account…");
          setTimeout(() => navigateTo("/account", true), 1500);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Could not connect to server. Please try again.");
      });
  }, [login]);

  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        {status === "verifying" && <Loader2 className="mx-auto animate-spin text-primary" size={48} />}
        {status === "success" && <CheckCircle2 className="mx-auto text-emerald-500" size={48} />}
        {status === "error" && <XCircle className="mx-auto text-red-500" size={48} />}

        <h1 className="mt-6 text-xl font-bold">
          {status === "verifying" && "Verifying Email"}
          {status === "success" && "Email Verified"}
          {status === "error" && "Verification Failed"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>

        {status === "error" && (
          <Link
            to="/login"
            className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-90"
          >
            Back to Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
