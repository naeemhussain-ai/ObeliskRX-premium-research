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
import vaccineImg from "@/assets/products/vacine.jpg";
import heroVideo from "@/assets/products/video Herosection.mp4";

function HeroVideoBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

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
          {/* HERO YOUTUBE BACKGROUND VIDEO */}
          <HeroVideoBackground />
          {/* SLATE GRAY OVERLAY RGB(94, 113, 128) */}
          <div className="absolute inset-0 bg-[rgb(94,113,128)]/65 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30" />

          <div className="relative flex min-h-[500px] flex-col items-center justify-center px-4 py-16 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight">
              Premium Peptides
              <span className="mt-1 block text-primary">You Can Trust</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm font-medium text-gray-800 sm:text-base leading-relaxed">
              The highest quality peptides, backed by science. Every batch is independently tested
              and verified to 99%+ purity before it ever reaches you.
            </p>

            <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
              {trustCards.map(({ icon: Icon, title, sub }) => (
                <div
                  key={title}
                  className="group flex items-center gap-3.5 rounded-xl border-2 border-[rgb(94,113,128)]/40 bg-white/90 p-4 text-left shadow-sm backdrop-blur transition-all duration-300 hover:border-primary hover:shadow-md"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[rgb(94,113,128)]/20 text-[rgb(94,113,128)] transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary">
                      {title}
                    </span>
                    <span className="block text-xs font-medium text-gray-600">{sub}</span>
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/catalog"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90 hover:shadow-lg"
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
          <div className="overflow-hidden rounded-xl border border-border shadow-md">
            <img
              src={vaccineImg}
              alt="About ObeliskRX Research"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative overflow-hidden border-t border-b border-border bg-surface py-20">
        {/* Soft background ambient gradient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="container-page relative z-10">
          {/* Section Header */}
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[11px] font-bold tracking-widest text-primary uppercase">
              Why ObeliskRX
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              The Standard Others Don't Meet
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-gray-600">
              Every decision we make is driven by research integrity — from sourcing to delivery.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {features.map(({ icon: Icon, title, text }, idx) => (
              <div
                key={title}
                className="group relative flex flex-col rounded-2xl border border-gray-200/90 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
              >
                {/* Number badge */}
                <span className="absolute right-4 top-4 text-[11px] font-bold text-gray-300 transition-colors duration-300 group-hover:text-primary">
                  0{idx + 1}
                </span>

                {/* Icon Circle */}
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-gray-200 bg-gray-100/90 text-[rgb(94,113,128)] transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(233,30,99,0.25)]">
                  <Icon size={22} />
                </div>

                {/* Thin accent line */}
                <div className="mx-auto mb-4 h-px w-8 bg-gray-200 transition-all duration-300 group-hover:w-14 group-hover:bg-primary" />

                <h3 className="text-sm font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-primary">
                  {title}
                </h3>
                <p className="mt-3 text-[12px] leading-relaxed text-gray-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
