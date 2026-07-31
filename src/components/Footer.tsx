import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Music2 } from "lucide-react";
import { Logo } from "./ProductCard";

const bullets = [
  "Government regulations governing the use of, and exposure to, these products",
  "The health and safety hazards associated with handling the products purchased",
  "The necessity of providing adequate warning of those health and safety hazards to any other party who may handle the product",
];

export function Notice() {
  return (
    <section className="bg-ink px-4 pt-10">
      <div className="container-page rounded-lg bg-ink p-6 text-[12px] leading-relaxed text-ink-foreground/85 sm:p-10">
        <h2 className="mb-4 text-[13px] font-bold text-ink-foreground">Notice</h2>
        <div className="space-y-4">
          <p>
            All peptides sold on this site are intended exclusively for laboratory and research use..
            Products may not be used as a cosmetic, food additive, chemical, drug, or for any
            application not classified as such in this notice. The listing of a material on this
            site does not constitute a license to use it in infringement of any patent.
          </p>
          <p>
            By purchasing, each customer represents and warrants that they have independently
            reviewed and are fully informed of:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p>
            ObeliskRX reserves the right to cancel any order if there is reason to believe the
            products are being purchased for a use other than the research purpose for which they
            are sold.
          </p>
          <p>
            ObeliskRX's products are intended solely for laboratory research use and are not to be
            used for in vitro diagnostic purposes, or in food, drugs, medical devices, or cosmetics
            for humans or animals, or for any commercial purpose. The purchaser acknowledges that
            these products have not been tested by ObeliskRX for safety or efficacy in any food,
            drug, medical device, cosmetic, commercial, or other application.
          </p>
          <p>
            The purchaser expressly represents and warrants to ObeliskRX that they will test, use,
            manufacture, and market any products purchased — and any materials produced using them —
            in accordance with the practices of a reasonably prudent person experienced in the
            field, and in strict compliance with all applicable laws and regulations, now in effect
            or hereinafter enacted.
          </p>
        </div>
      </div>
    </section>
  );
}

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/" },
  { label: "Catalogue", to: "/catalog" },
  { label: "Contact Us", to: "/contact" },
] as const;

const usefulLinks = [
  { label: "FAQ", to: "/faq" },
  { label: "Refund & Returns", to: "/refund-policy" },
  { label: "Privacy Policy", to: "/" },
  { label: "Terms of Service", to: "/" },
];

const payments = ["VISA", "stripe", "PayPal", "G Pay", "Apple Pay"];

export function Footer() {
  return (
    <footer className="bg-ink px-4 pb-8 pt-10">
      <div className="container-page rounded-lg bg-ink pb-8">
        <div className="grid gap-10 border-b border-ink-foreground/10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="h-8" light />
            <p className="mt-4 max-w-64 text-sm text-ink-foreground/70">
              Research-grade peptides, verified for precision and integrity.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Music2].map((Icon, i) => (
                <span
                  key={i}
                  className="grid size-8 place-items-center rounded-full bg-ink-foreground/10 text-ink-foreground/80"
                >
                  <Icon size={15} />
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-ink-foreground/10 pt-5">
              {payments.map((p) => (
                <span key={p} className="text-[11px] font-semibold text-ink-foreground/60">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-ink-foreground">Quick Links</h3>
            <ul className="space-y-3 text-sm text-ink-foreground/70">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-ink-foreground">Useful Links</h3>
            <ul className="space-y-3 text-sm text-ink-foreground/70">
              {usefulLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-ink-foreground">Contact Info</h3>
            <p className="text-sm text-ink-foreground/70">Email: Contact@ObeliskRX.com</p>
            <p className="mt-4 text-sm text-ink-foreground/70">
              Business Hours:
              <br />
              Monday - Friday 9:00 AM - 5:00 PM EST
            </p>
          </div>
        </div>
        <p className="pt-6 text-center text-xs text-ink-foreground/50">Copyright 2026 OBELISKRX</p>
      </div>
    </footer>
  );
}
