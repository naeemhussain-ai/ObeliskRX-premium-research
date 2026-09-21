import { useState } from "react";
import { CheckCircle2, UploadCloud } from "lucide-react";
import { useAuth, AUTH_API } from "@/lib/auth";

export function PaymentProofForm({ orderNumber, defaultFullName, onSubmitted }: { orderNumber: string; defaultFullName: string; onSubmitted?: () => void }) {
  const { token } = useAuth();
  const [fullName, setFullName] = useState(defaultFullName);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Please attach a screenshot or photo of your payment."); return; }
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("order_number", orderNumber);
      formData.append("full_name", fullName);
      formData.append("proof", file);

      const res = await fetch(`${AUTH_API}/orders/upload-payment-proof.php`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onSubmitted?.();
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
        <CheckCircle2 className="mx-auto text-emerald-500" size={40} />
        <span className="mt-3 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
          Status: Pending
        </span>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll confirm your payment, and then your order will be approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Submit Payment Proof</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Already sent the payment? Upload a screenshot or photo of the confirmation below.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium">Order Number</label>
        <input
          type="text"
          value={orderNumber}
          readOnly
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-muted-foreground outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Payment Screenshot</label>
        <label
          htmlFor="payment-proof-file"
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-6 text-center transition-colors hover:border-primary/50"
        >
          <UploadCloud size={24} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {file ? file.name : "Click to upload a screenshot or photo"}
          </span>
          <span className="text-xs text-muted-foreground">JPG, PNG, WEBP or PDF, up to 8MB</span>
        </label>
        <input
          id="payment-proof-file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
          className="hidden"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Payment Proof"}
      </button>
    </form>
  );
}
