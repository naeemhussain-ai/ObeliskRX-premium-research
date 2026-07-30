import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Grid2x2, Grid3x3, LayoutGrid } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { catalogPageOne } from "@/lib/products";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Shop Research Peptides — ObeliskRX Catalog" },
      {
        name: "description",
        content:
          "Browse the full ObeliskRX catalog of research peptides — metabolic, recovery, growth, longevity, and neuro series. COA verified.",
      },
      { property: "og:title", content: "Shop Research Peptides — ObeliskRX Catalog" },
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

  const gridClass =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="container-page py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>{" "}
            / <span className="font-medium text-foreground">Shop</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Show :</span>
            {showOptions.map((n, i) => (
              <span key={n} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <button
                  type="button"
                  onClick={() => setShow(n)}
                  className={show === n ? "font-bold text-primary" : "hover:text-primary"}
                >
                  {n}
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
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
                className={cols === n ? "text-primary" : "hover:text-primary"}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
          <select
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
            defaultValue="default"
          >
            <option value="default">Default sorting</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${gridClass}`}>
        {catalogPageOne.slice(0, show).map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center gap-2 text-sm">
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-1 font-semibold text-primary-foreground"
        >
          1
        </button>
        <button type="button" className="rounded-md px-3 py-1 hover:text-primary">
          2
        </button>
        <button type="button" aria-label="Next page" className="px-2 hover:text-primary">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
