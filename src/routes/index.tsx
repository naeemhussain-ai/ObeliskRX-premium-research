import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Beaker,
  Headphones,
  Lock,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { featuredProducts } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ObeliskRX — Premium Research Peptides You Can Trust" },
      {
        name: "description",
        content:
          "Premium research peptides independently tested and verified to 99%+ purity. Fast USA shipping, COA on every batch. Research use only.",
      },
      { property: "og:title", content: "ObeliskRX — Premium Research Peptides" },
      {
        property: "og:description",
        content: "Independently tested peptides verified to 99%+ purity. Research use only.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const trustCards = [
  { icon: ShieldCheck, title: "99%+ Purity", sub: "Lab Verified" },
  { icon: BadgeCheck, title: "Independently Tested", sub: "COA Verified" },
  { icon: Truck, title: "Fast USA Shipping", sub: "Same Day Shipping" },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Built for research integrity",
    text: "Every order is backed by fast fulfillment, third-party verified purity, and responsive support so researchers can source with confidence.",
  },
  {
    icon: Truck,
    title: "Fast shipping",
    text: "Orders placed before 2pm, Monday through Thursday, ship the same day.",
  },
  {
    icon: Beaker,
    title: "Third-party tested",
    text: "Every batch is independently lab tested to confirm peptide identity and purity.",
  },
  {
    icon: Headphones,
    title: "Responsive support",
    text: "Call or text us for fast, direct answers to your questions.",
  },
  {
    icon: Lock,
    title: "Secure checkout",
    text: "Every transaction is protected by a secure, encrypted checkout process.",
  },
];

function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="container-page pt-6">
        <div className="relative min-h-[500px] overflow-hidden rounded-lg">
          {/*
            HERO VIDEO: Upload your background video here. Use autoplay, muted, loop, playsInline.
            USER: REPLACE THIS DIV WITH BACKGROUND VIDEO
            <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline src="/hero.mp4" />
          */}
          <div className="absolute inset-0 bg-ink" />
          {/* HERO OVERLAY: dark gradient overlay on top of video */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />

          <div className="relative flex min-h-[500px] flex-col items-center justify-center px-4 py-16 text-center">
            <span className="rounded-full border border-primary bg-primary/20 px-4 py-1 text-[11px] font-bold tracking-widest text-primary-foreground">
              TRUSTED BY THOUSANDS
            </span>
            <h1 className="mt-6 text-4xl font-bold text-ink-foreground sm:text-5xl">
              Premium Peptides
              <span className="mt-1 block text-primary">You Can Trust</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm text-ink-foreground/80 sm:text-base">
              The highest quality peptides, backed by science. Every batch is independently tested
              and verified to 99%+ purity before it ever reaches you.
            </p>

            <div className="mt-8 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
              {trustCards.map(({ icon: Icon, title, sub }) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 p-4 text-left backdrop-blur"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink-foreground">
                      {title}
                    </span>
                    <span className="block text-xs text-ink-foreground/70">{sub}</span>
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/catalog"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="container-page py-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-xs font-medium text-ink-foreground hover:bg-primary"
          >
            More Products <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="container-page pb-16">
        <div className="grid items-center gap-12 rounded-lg bg-card p-6 shadow-card sm:p-10 lg:grid-cols-[3fr_2fr]">
          <div>
            <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
              About Us
            </span>
            <h2 className="mb-6 mt-4 text-3xl font-bold">About ObeliskRX</h2>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                ObeliskRX was built on a simple premise: researchers deserve to know exactly what
                they're working with.
              </p>
              <p>
                Every compound we distribute is sourced from vetted manufacturers and independently
                tested before it reaches you — not spot-checked, not assumed, verified. Every batch
                carries its own certificate of analysis, available to review before you order.
              </p>
              <p>
                We built this company because the research peptide space has too often rewarded
                speed over scrutiny. We chose the opposite path: documentation first, transparency
                by default, and a standard of proof behind every product we carry.
              </p>
              <p>
                ObeliskRX is a research-use-only supplier. Our products are intended for laboratory
                and research applications only, not for human or animal consumption.
              </p>
            </div>
            <button
              type="button"
              className="mt-6 rounded-full border border-primary px-6 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
            >
              Read More
            </button>
          </div>
          {/* ABOUT IMAGE: Upload lab/research team photo */}
          <div className="grid aspect-[4/3] place-items-center rounded-lg bg-secondary text-xs font-medium tracking-widest text-muted-foreground">
            ABOUT SECTION IMAGE — lab/research photo
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="border-t border-border bg-background">
        <div className="container-page grid gap-8 py-16 text-center sm:grid-cols-2 lg:grid-cols-5">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center">
              <span className="mb-4 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
                <Icon size={20} />
              </span>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
