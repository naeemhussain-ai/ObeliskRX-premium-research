import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "@/lib/router";

const sections = [
  {
    category: "Ordering & Eligibility",
    qa: [
      {
        q: "Do I need to be 21 or older to order from ObeliskRX?",
        a: "Yes. All visitors must be 21 years of age or older to enter the site or place an order, and must confirm this before proceeding.",
      },
      {
        q: "What is ObeliskRX's intended use policy?",
        a: "All products sold on ObeliskRX are intended strictly for laboratory and research use. They are not for human or animal consumption, and are not intended to diagnose, treat, cure, or prevent any disease. By purchasing, you confirm you are a qualified researcher purchasing in accordance with applicable laws.",
      },
    ],
  },
  {
    category: "Product Quality & Testing",
    qa: [
      {
        q: "Are your products third-party tested?",
        a: "Yes. Every batch is independently tested, and results are published as a Certificate of Analysis (COA) before the product is offered for sale.",
      },
      {
        q: "Where can I find a product's COA?",
        a: "Every product page links directly to our COA Results page, where you can review batch-specific testing documentation.",
      },
      {
        q: "What form do your peptides come in?",
        a: "Unless otherwise noted on the product page, all peptides are supplied in lyophilized powder form.",
      },
      {
        q: "How should I store my products?",
        a: "Storage instructions are listed on each individual product page, as recommended storage can vary by compound.",
      },
    ],
  },
  {
    category: "Shipping",
    qa: [
      {
        q: "How fast is shipping?",
        a: "Orders placed before 2pm, Monday through Thursday, ship the same day.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes, on orders over $250.",
      },
    ],
  },
  {
    category: "Payment",
    qa: [
      {
        q: "What payment methods do you accept?",
        a: "We currently accept Zelle and Cash App for orders while our full checkout system is being finalized. Once our secure payment processor is live, we will also accept major credit/debit cards, ACH bank transfer, and cryptocurrency   with an instant 15% discount applied on crypto payments at checkout.",
      },
      {
        q: "Is checkout secure?",
        a: "Yes. Every transaction is protected through a secure, encrypted checkout process.",
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center justify-between gap-4 py-5 text-left outline-none"
      >
        <span className={`text-sm font-semibold leading-snug transition-colors duration-200 group-hover:text-primary ${open ? "text-primary" : "text-gray-900"}`}>
          {q}
        </span>
        <span className={`grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${open ? "bg-primary/10 text-primary rotate-180" : "bg-gray-50 text-gray-400 group-hover:bg-primary/5 group-hover:text-primary"}`}>
          <ChevronDown size={18} />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-gray-600">{a}</p>
      </div>
    </div>
  );
}

export function FaqPage() {
  const [contentRef, contentVisible] = useStaggerAnimation<HTMLDivElement>();

  return (
    <div className="min-h-screen bg-background">
      {/* Page Hero */}
      <div className="relative overflow-hidden border-b border-border bg-surface py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
        </div>
        <div className="container-page relative z-10 text-center anim-fade-in-up">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-widest text-primary uppercase shadow-sm">
            Help Center
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Everything you need to know about ordering, shipping, product quality, and payment.
          </p>
          {/* Breadcrumb */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-foreground">FAQs</span>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container-page py-20">
        <div 
          ref={contentRef}
          className={`mx-auto max-w-3xl space-y-12 animate-on-scroll ${contentVisible ? "animate-visible" : ""}`}
        >
          {sections.map((section, idx) => (
            <div 
              key={section.category}
              className="anim-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Category Header */}
              <div className="mb-4 flex items-center gap-4">
                <h2 className="shrink-0 text-xl font-extrabold tracking-tight text-foreground">
                  {section.category}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>

              {/* Accordion Card */}
              <div className="rounded-2xl border border-border bg-white px-6 shadow-card-hover transition-shadow duration-300 hover:shadow-xl">
                {section.qa.map(({ q, a }) => (
                  <AccordionItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          ))}

          {/* Bottom CTA */}
          <div 
            className="mt-16 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 px-8 py-10 text-center shadow-lg anim-fade-in-up"
            style={{ animationDelay: `${sections.length * 100}ms` }}
          >
            <h3 className="text-lg font-bold text-foreground">Still have questions?</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Our team is here to help. Reach out and we'll get back to you quickly with the answers you need.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
