import { Facebook, Instagram } from "lucide-react";
import { Link } from "@/lib/router";
import { Logo } from "./ProductCard";

function TikTokIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

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
            All peptides sold on this site are intended exclusively for laboratory and research use.
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
            manufacture, and market any products purchased   and any materials produced using them  
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
  { label: "Catalogue", to: "/catalog" },
  { label: "Articles", to: "/research-articles" },
  { label: "COA", to: "/coa" },
  { label: "Contact Us", to: "/contact" },
] as const;

const usefulLinks = [
  { label: "FAQ", to: "/faq" },
  { label: "Refund & Returns", to: "/refund-policy" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms" },
];

const payments = ["VISA", "stripe", "PayPal", "G Pay", "Apple Pay"];

export function Footer() {
  return (
    <footer className="bg-ink px-4 pb-8 pt-10">
      <div className="container-page rounded-lg bg-ink pb-8">
        <div className="grid gap-10 border-b border-ink-foreground/10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-block">
              <Logo className="h-10" light={true} />
            </Link>
            <p className="mt-4 max-w-64 text-sm text-ink-foreground/70">
              Research-grade peptides, verified for precision and integrity.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61592343771096"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-8 place-items-center rounded-full bg-ink-foreground/10 text-ink-foreground/80 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook size={15} />
              </a>
              <a
                href="https://www.instagram.com/obeliskrx_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-8 place-items-center rounded-full bg-ink-foreground/10 text-ink-foreground/80 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://www.tiktok.com/@obeliskrx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="grid size-8 place-items-center rounded-full bg-ink-foreground/10 text-ink-foreground/80 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <TikTokIcon size={15} />
              </a>
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
            <p className="text-sm text-ink-foreground/70 leading-relaxed">
              ObeliskRX LLC<br />
              1489 W. Palmetto Park Rd. Suite 500<br />
              Boca Raton, FL 33486 US
            </p>
            <a href="tel:+15615718899" className="mt-3 block text-sm text-ink-foreground/70 hover:text-primary transition-colors">
              Ph: (561) 571-8899
            </a>
            <a href="mailto:Contact@ObeliskRX.com" className="mt-1 block text-sm text-ink-foreground/70 hover:text-primary transition-colors">
              Contact@ObeliskRX.com
            </a>
            <p className="mt-3 text-sm text-ink-foreground/70">
              Mon – Fri: 9:00 AM – 5:00 PM EST
            </p>
          </div>
        </div>
        <p className="pt-6 text-center text-xs text-ink-foreground/50">Copyright 2026 OBELISKRX</p>
      </div>
    </footer>
  );
}
