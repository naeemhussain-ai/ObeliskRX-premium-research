import { useState } from "react";
import {
  ArrowRight,
  Beaker,
  ClipboardList,
  Headphones,
  Lock,
  ShieldCheck,
  Target,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "@/lib/router";
import { useProducts } from "@/lib/products";
import vaccineImg from "@/assets/products/vacine.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const whyCards = [
  { icon: ShieldCheck, title: "Verified Quality", sub: "Independent analytical testing." },
  { icon: ClipboardList, title: "Clear Documentation", sub: "Batch-specific records and COAs." },
  { icon: Target, title: "Reliable Standards", sub: "Consistent research-focused practices." },
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

export function HomePage() {
  const products = useProducts();
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");

  const categories = ["All", "Metabolic Series", "Recovery Series", "Growth Series", "Longevity Series", "Neuro Series", "Signature Blends"];
  const priceRanges = [
    { label: "All Prices", value: "All" },
    { label: "Under $50", value: "under50" },
    { label: "$50 - $100", value: "50to100" },
    { label: "Over $100", value: "over100" },
  ];

  const filteredProducts = products.filter((p) => {
    if (filterCategory !== "All" && p.series !== filterCategory) return false;
    if (filterPrice === "under50" && p.price >= 50) return false;
    if (filterPrice === "50to100" && (p.price < 50 || p.price > 100)) return false;
    if (filterPrice === "over100" && p.price <= 100) return false;
    return true;
  }).slice(0, 8);

  return (
    <>
      {/* ===== HERO + TRUST BAR (integrated) ===== */}
      <section className="hero-section relative w-full -mt-[68px]" style={{ minHeight: "720px", height: "100vh", maxHeight: "900px" }}>
        {/* Hero background */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: "center right" }}
        />
        {/* Light navy overlay */}
        <div className="absolute inset-0 bg-[#0B1F3A]/30" />
        {/* Dark fade at bottom for trust bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(11,31,58,0) 0%, rgba(11,31,58,0.95) 100%)" }}
        />

        {/* Hero content */}
        <div className="relative z-[2] flex h-full flex-col justify-center px-6 pt-[68px] pb-28 container-page">
          {/* Badge */}
          <div className="mb-6">
            <span className="text-[11px] font-bold tracking-widest text-[#F47A38] uppercase">
              Precision for Discovery
            </span>
            <div className="mt-1.5 h-0.5 w-10 bg-[#F47A38]" />
          </div>

          <h1
            className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[52px]"
            style={{ fontFamily: "Manrope, sans-serif", textShadow: "0 2px 20px rgba(11,31,58,.4)" }}
          >
            Research begins with<br />better standards.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            High-purity research compounds supported by transparent testing and accessible documentation.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-[#0B1F3A] transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
              style={{ background: "#F47A38", borderRadius: "0" }}
            >
              Explore Products
            </Link>
            <Link
              to="/coa"
              className="inline-flex items-center gap-2 px-2 py-3.5 text-sm font-semibold text-white transition-all duration-300 border-b-2 border-[#F47A38] hover:text-[#F47A38]"
            >
              View COAs
            </Link>
          </div>
        </div>

        {/* Trust bar — frosted glass container */}
        <div className="absolute bottom-0 left-0 right-0 z-[2] px-4 pb-10">
          <div className="hero-features flex flex-wrap items-center justify-center divide-x divide-white/20">
            {["Independent Testing", "Batch Documentation", "Research Use Only"].map((item) => (
              <span key={item} className="px-8 py-1 text-sm font-medium text-white/80 tracking-wide">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY OBELISKRX ===== */}
      <section className="relative pt-16 pb-20 text-center" style={{ marginTop: "-1px", backgroundColor: "#F7F3EC", border: 0, boxShadow: "none" }}>
        <div className="container-page">
        <span className="text-[11px] font-bold tracking-widest text-[#F47A38] uppercase">Why ObeliskRX</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-4xl" style={{ fontFamily: "Manrope, sans-serif" }}>
          Clarity at every stage of research.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {whyCards.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-2xl border border-[#D9E0E7] bg-white p-8 text-center shadow-[0_10px_30px_rgba(11,31,58,.06)]"
            >
              <span className="mb-5 grid size-14 place-items-center rounded-full border-2 border-[#D9E0E7]">
                <Icon size={22} className="text-[#174A7E]" />
              </span>
              <p className="text-base font-bold text-[#0B1F3A]">{title}</p>
              <p className="mt-2 text-sm text-[#5F6B76]">{sub}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="container-page py-16">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-border pb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Filter by category and price range to find the perfect research peptide.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ink-foreground transition-all hover:bg-primary hover:shadow-lg active:scale-95"
          >
            View Entire Catalog <ArrowRight size={16} />
          </Link>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-gray-700 mr-2">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCategory(c)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  filterCategory === c
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-surface text-gray-600 hover:bg-primary/10 hover:text-primary border border-border"
                }`}
              >
                {c.replace(" Series", "")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-bold text-gray-700">Price:</span>
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none transition-colors focus:border-primary cursor-pointer"
            >
              {priceRanges.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-surface border border-border">
            <p className="text-gray-500 font-medium">No products match the selected filters.</p>
            <button 
              onClick={() => { setFilterCategory("All"); setFilterPrice("All"); }}
              className="mt-4 text-sm font-bold text-primary underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((p) => (
              <div key={p.slug} className="anim-fade-in-up">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
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
                tested before it reaches you   not spot-checked, not assumed, verified. Every batch
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
            <Link
              to="/about"
              className="mt-6 inline-block rounded-full border border-primary px-6 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
            >
              Read More
            </Link>
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
              Every decision we make is driven by research integrity   from sourcing to delivery.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {features.map(({ icon: Icon, title, text }, idx) => (
              <div
                key={title}
                className="group relative flex flex-col rounded-2xl border border-gray-200/90 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
              >
                

                {/* Icon Circle */}
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-gray-200 bg-gray-100/90 text-[#6FA9D8] transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(244,122,56,0.25)]">
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

