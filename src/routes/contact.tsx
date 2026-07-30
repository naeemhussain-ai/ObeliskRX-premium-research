import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Mail } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ObeliskRX — Research Peptide Support" },
      {
        name: "description",
        content:
          "Get in touch with the ObeliskRX team. Email Contact@Obeliskrx.com, Monday to Friday 9:00 AM - 5:00 PM EST.",
      },
      { property: "og:title", content: "Contact ObeliskRX" },
      {
        property: "og:description",
        content: "Questions about a compound or an order? Reach the ObeliskRX team.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const inputClass =
  "w-full rounded-full border border-border bg-card px-5 py-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]";

function Contact() {
  const [contentRef, contentVisible] = useScrollAnimation<HTMLDivElement>();

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

        <div className="rounded-2xl bg-card p-6 shadow-card sm:p-10 anim-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h2 className="mb-6 text-2xl font-bold">Send us a message</h2>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-5 sm:grid-cols-2">
              <input className={inputClass} placeholder="Your name *" required />
              <input className={inputClass} type="email" placeholder="Your Email *" required />
            </div>
            <input className={inputClass} placeholder="Subject" />
            <textarea
              rows={5}
              className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)] resize-y"
              placeholder="Your Message *"
              required
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Ask A Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
