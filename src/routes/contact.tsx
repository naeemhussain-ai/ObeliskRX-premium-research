import { useState } from "react";
import { Clock, Mail, CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "@/lib/router";

const API = import.meta.env.VITE_API_URL ?? "http://localhost/obeliskrx/api";

const inputClass =
  "w-full rounded-full border border-border bg-card px-5 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]";

export function ContactPage() {
  const [contentRef, contentVisible] = useScrollAnimation<HTMLDivElement>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API}/contact/submit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setName(""); setEmail(""); setSubject(""); setMessage("");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-8">
      <div className="anim-fade-in-up">
        <h1 className="text-4xl font-extrabold tracking-tight">Contact</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>{" "}
          / <span className="font-medium text-foreground">Contact</span>
        </p>
      </div>

      <div
        ref={contentRef}
        className={`grid gap-12 py-12 lg:grid-cols-[2fr_3fr] animate-on-scroll ${contentVisible ? "animate-visible" : ""}`}
      >
        <div className="anim-fade-in-up" style={{ animationDelay: "100ms" }}>
          <h2 className="mb-8 text-2xl font-bold">Get in Touch</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110">
                <Mail size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold">Email</p>
                <p className="mt-1 text-sm text-muted-foreground">Contact@Obeliskrx.com</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110">
                <Clock size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold">Business Hours</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Monday - Friday 9:00 AM - 5:00 PM EST
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl bg-card p-6 shadow-card sm:p-10 anim-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <h2 className="mb-6 text-2xl font-bold">Send us a message</h2>

          {success ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="text-emerald-500" size={52} />
              <p className="mt-4 text-lg font-bold">Message Sent!</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We'll get back to you within 1–2 business days.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-6 rounded-full border border-border px-6 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Your name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className={inputClass}
                  type="email"
                  placeholder="Your Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <input
                className={inputClass}
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <textarea
                rows={5}
                className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)] resize-y"
                placeholder="Your Message *"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending…" : "Ask A Question"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
