import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { CoaDialog } from "@/components/CoaDialog";
import { coaData } from "@/lib/coa";
import { products } from "@/lib/products";

const coaRecords = products
  .filter((p) => coaData[p.slug])
  .map((p) => ({
    slug: p.slug,
    compound: p.name,
    purity: coaData[p.slug].purity,
    tested: coaData[p.slug].tested,
    images: coaData[p.slug].images,
  }));

const testingMethods = [
  {
    step: "01",
    title: "HPLC purity",
    text: "Reverse-phase high-performance liquid chromatography quantifies peptide purity. Lots must measure 99%+ by integrated peak area for release, and the chromatogram is published with the COA.",
  },
  {
    step: "02",
    title: "LC-MS identity",
    text: "Electrospray-ionization mass spectrometry confirms molecular weight and sequence integrity, flagging synthesis errors or modifications before material leaves the bench.",
  },
  {
    step: "03",
    title: "Heavy metals & endotoxin",
    text: "ICP-MS detects lead, arsenic, and mercury below 10ppm. Bacterial endotoxins are quantified by LAL assay, with counterion content reported per lot.",
  },
];

export function CoaPage() {
  const [query, setQuery] = useState("");
  const [openCert, setOpenCert] = useState<{ images: string[]; title: string } | null>(null);
  const [heroRef, heroVisible] = useStaggerAnimation<HTMLElement>();
  const [tableRef, tableVisible] = useStaggerAnimation<HTMLElement>();
  const [methodsRef, methodsVisible] = useStaggerAnimation<HTMLElement>();

  const filtered = coaRecords.filter((r) =>
    r.compound.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="pb-8">
      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className={`bg-[rgb(94,113,128)] py-16 md:py-20 px-4 animate-on-scroll ${heroVisible ? "animate-visible" : ""}`}
      >
        <div className="container-page">
          <span className="anim-fade-in-up inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
            Research
          </span>
          <h1 className="anim-fade-in-up animate-delay-1 mt-4 text-4xl font-bold text-white md:text-5xl">
            Every lot, published.
          </h1>
          <p className="anim-fade-in-up animate-delay-2 mt-5 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base">
            Every ObeliskRX batch ships with a third-party Certificate of Analysis. Search by
            compound name to review purity, identity, and contaminant screening results.
          </p>
        </div>
      </section>

      {/* ===== LOOKUP TABLE ===== */}
      <section
        ref={tableRef}
        className={`container-page py-16 animate-on-scroll animate-scale ${tableVisible ? "animate-visible" : ""}`}
      >
        <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
          COA Lookup
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">Find the COA for your compound.</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Search by compound name below, then select View COA to review the analytical package
          for that batch.
        </p>

        <div className="relative mt-6 max-w-lg">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by compound - try 'Reta' or 'NAD'"
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Showing {filtered.length} of {coaRecords.length} documents
        </p>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-4">Compound</th>
                <th className="px-5 py-4">Purity</th>
                <th className="px-5 py-4">Tested</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No documents matched "{query}".
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.slug} className="border-b border-border last:border-0 hover:bg-surface/60">
                    <td className="px-5 py-4 font-semibold">{r.compound}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.purity}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.tested}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setOpenCert({ images: r.images, title: r.compound })}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View COA →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== TESTING METHODS ===== */}
      <section
        ref={methodsRef}
        className={`border-t border-border bg-surface py-16 animate-on-scroll ${methodsVisible ? "animate-visible" : ""}`}
      >
        <div className="container-page">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
            Testing Methods
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            What we measure on every lot before it ships.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            All testing is performed in-house and re-run by an independent ISO 17025-accredited
            laboratory. Both result sets are published against the lot.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {testingMethods.map((m) => (
              <div
                key={m.step}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <ShieldCheck size={16} />
                  {m.step}
                </div>
                <h3 className="mt-3 text-base font-bold">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CoaDialog
        open={openCert !== null}
        onOpenChange={(open) => !open && setOpenCert(null)}
        images={openCert?.images ?? []}
        title={openCert?.title ?? ""}
      />
    </div>
  );
}
