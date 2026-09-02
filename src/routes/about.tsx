import { useState } from "react";
import { ChevronDown, ArrowRight, FlaskConical } from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { navigateTo } from "@/lib/router";

const aboutParagraphs = [
  "Welcome to ObeliskRX, your source for rigorously documented peptides for laboratory and research use. Our mission is simple   give researchers material they can trust, backed by proof, not claims.",
  "Every compound we distribute is sourced from vetted manufacturers and independently tested before it ever reaches you. Each batch is verified by third-party lab analysis, with a certificate of analysis available for review   because in research, verification isn't optional, it's foundational.",
  "Our commitment to transparency extends to how we support you. Our team is responsive and knowledgeable, ready to answer questions about sourcing, testing, and documentation for any product in our catalog.",
  "We prioritize fast, reliable fulfillment so your research timeline stays on track   orders placed before cutoff ship the same day.",
  "ObeliskRX was founded on the belief that the research peptide industry should hold itself to a stricter standard of proof. As the field continues to evolve, we remain committed to documentation-first sourcing and uncompromising quality control on every product we carry.",
  "ObeliskRX is a research-use-only supplier. Our products are intended for laboratory and research applications only, not for human or animal consumption.",
];

export function AboutPage() {
  const [expanded, setExpanded] = useState(false);

  // Animation hooks
  const [heroRef, heroVisible] = useStaggerAnimation<HTMLElement>();
  const [contentRef, contentVisible] = useStaggerAnimation<HTMLElement>();
  const [ctaRef, ctaVisible] = useStaggerAnimation<HTMLElement>();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-8">
      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className={`relative overflow-hidden py-20 md:py-24 px-4 animate-on-scroll ${heroVisible ? "animate-visible" : ""}`}
        style={{ background: "linear-gradient(135deg, #174A7E 0%, #3A7BC8 45%, #F47A38 80%, #FFB15A 100%)", minHeight: "380px" }}
      >
        <div className="container-page">
          <h1 className="anim-fade-in-up text-4xl md:text-5xl font-bold text-white mb-6">Who We Are</h1>
          <p className="anim-fade-in-up animate-delay-1 text-white/90 text-base md:text-lg max-w-3xl leading-relaxed">
            Welcome to ObeliskRX, a research-use-only peptide supplier built on a single
            standard: documentation before distribution. We exist to give researchers the verified
            materials they need to move their work forward with confidence.
          </p>
        </div>
      </section>

      {/* ===== BODY CONTENT ===== */}
      <section 
        ref={contentRef}
        className={`max-w-4xl mx-auto py-12 md:py-16 px-4 animate-on-scroll animate-scale ${contentVisible ? "animate-visible" : ""}`}
      >
        <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
          {aboutParagraphs.slice(0, expanded ? undefined : 3).map((para, idx) => (
            <p key={idx} className="anim-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>{para}</p>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-6 inline-flex items-center gap-1 text-xs text-muted-foreground border border-border rounded-full px-4 py-2 hover:border-primary hover:text-primary transition-colors duration-300"
        >
          {expanded ? "Show Less" : "Read More"}
          <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </button>
      </section>

      {/* ===== CTA   SHOP PRODUCTS ===== */}
      <section
        ref={ctaRef}
        className={`container-page pb-16 animate-on-scroll animate-scale ${ctaVisible ? "animate-visible" : ""}`}
      >
        <div
          className="relative rounded-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14 shadow-card"
          style={{ background: "linear-gradient(135deg, #0B1F3A 0%, #174A7E 100%)" }}
        >
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <FlaskConical size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight">
                Explore Our Research Compounds
              </h3>
              <p className="mt-1 text-white/70 text-sm md:text-base max-w-md">
                Browse our full catalog of third-party tested peptides   each with a published Certificate of Analysis.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo("/catalog")}
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#0B1F3A] shadow-lg hover:bg-white/90 transition-colors duration-200"
          >
            Shop Products
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}

