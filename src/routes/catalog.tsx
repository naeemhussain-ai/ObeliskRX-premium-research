import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Grid2x2, Grid3x3, LayoutGrid } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { useStaggerAnimation } from "@/hooks/useScrollAnimation";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Shop Research Peptides   ObeliskRX Catalog" },
      {
        name: "description",
        content:
          "Browse the full ObeliskRX catalog of research peptides   metabolic, recovery, growth, longevity, and neuro series. COA verified.",
      },
      { property: "og:title", content: "Shop Research Peptides   ObeliskRX Catalog" },
      {
        property: "og:description",
        content: "Browse research peptides by series. Independently tested, 99%+ purity.",
      },
      { property: "og:url", content: "/catalog" },
    ],
    links: [{ rel: "canonical", href: "/catalog" }],
  }),
  component: Catalog,
});

const showOptions = [9, 12, 18, 24];

function Catalog() {
  const [show, setShow] = useState(12);
  const [cols, setCols] = useState(4);
  const [page, setPage] = useState(1);
  const [gridRef, gridVisible] = useStaggerAnimation<HTMLDivElement>();

  const totalPages = Math.ceil(products.length / show);
  const paginatedProducts = products.slice((page - 1) * show, page * show);

  const handleShowChange = (n: number) => {
    setShow(n);
    setPage(1);
  };

  const gridClass =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="container-page py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div className="anim-fade-in-up">
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>{" "}
            / <span className="font-medium text-foreground">Shop</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 anim-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-surface px-4 py-2 rounded-full border border-border shadow-sm">
            <span className="font-medium text-gray-700">Show :</span>
            {showOptions.map((n, i) => (
              <span key={n} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-300">/</span>}
                <button
                  type="button"
                  onClick={() => handleShowChange(n)}
                  className={`transition-colors ${show === n ? "font-bold text-primary" : "hover:text-primary"}`}
                >
                  {n}
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-surface px-3 py-2 rounded-full border border-border shadow-sm">
            {[
              { n: 2, Icon: Grid2x2 },
              { n: 3, Icon: Grid3x3 },
              { n: 4, Icon: LayoutGrid },
            ].map(({ n, Icon }) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} columns`}
                onClick={() => setCols(n)}
                className={`p-1 rounded transition-colors ${cols === n ? "text-primary bg-primary/10" : "hover:text-primary hover:bg-gray-100"}`}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
          <select
            className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-gray-700 shadow-sm outline-none focus:border-primary transition-colors cursor-pointer"
            defaultValue="default"
          >
            <option value="default">Default sorting</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
      </div>

      <div 
        ref={gridRef} 
        className={`grid grid-cols-1 gap-6 ${gridClass} animate-on-scroll animate-scale ${gridVisible ? "animate-visible" : ""}`}
      >
        {paginatedProducts.map((p, i) => (
          <div 
            key={p.slug} 
            className={`animate-on-scroll animate-scale ${gridVisible ? "animate-visible" : ""}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2 text-sm">
          <button 
            type="button" 
            aria-label="Previous page" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="grid size-9 place-items-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500"
          >
            <ChevronLeft size={18} />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className={`grid size-9 place-items-center rounded-full transition-all ${
                page === i + 1 
                  ? "bg-primary font-bold text-primary-foreground shadow-md hover:scale-105" 
                  : "font-medium text-gray-500 hover:bg-gray-100 hover:text-primary"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            type="button" 
            aria-label="Next page" 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="grid size-9 place-items-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
