import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Mail } from "lucide-react";

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
  "w-full rounded-full border border-border bg-card px-5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary";

function Contact() {
  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        / <span className="font-medium text-foreground">Contact</span>
      </p>

      <div className="grid gap-12 py-12 lg:grid-cols-[2fr_3fr]">
        <div>
          <h2 className="mb-8 text-2xl font-bold">Get in Touch</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Mail size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Email</p>
                <p className="text-sm text-muted-foreground">Contact@Obeliskrx.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Clock size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Business Hours</p>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday 9:00 AM - 5:00 PM EST
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-card p-6 shadow-card sm:p-10">
          <h2 className="mb-6 text-2xl font-bold">How We Start Our Business</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className={inputClass} placeholder="Your name" />
              <input className={inputClass} type="email" placeholder="Your Email" />
            </div>
            <input className={inputClass} placeholder="Customer care" />
            <textarea
              rows={5}
              className="w-full rounded-2xl border border-border bg-card px-5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              placeholder="Your Message"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Ask A Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
