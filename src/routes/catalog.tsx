import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  Grid3x3,
  LayoutGrid,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/products";
import { Link } from "@/lib/router";
import { useStaggerAnimation } from "@/hooks/useScrollAnimation";

const showOptions = [9, 12, 18, 24];

const allSeries = [
  "Metabolic Series",
  "Recovery Series",
  "Growth Series",
  "Longevity Series",
  "Neuro Series",
  "Signature Blends",
];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $150", min: 100, max: 150 },
  { label: "Over $150", min: 150, max: Infinity },
];

function FilterSidebar({
  selectedSeries,
  onSeriesChange,
  priceRange,
  onPriceRangeChange,
  onClear,
  activeCount,
  products,
}: {
  selectedSeries: string[];
  onSeriesChange: (s: string) => void;
  priceRange: number;
  onPriceRangeChange: (i: number) => void;
  onClear: () => void;
  activeCount: number;
  products: { series: string }[];
}) {
  const [seriesOpen, setSeriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-primary" />
            <span className="text-sm font-bold text-gray-900">Filters</span>
            {activeCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary transition-colors"
            >
              <X size={12} /> Clear all
            </button>
          )}
        </div>

        {/* Series Filter */}
        <div className="border-b border-border">
          <button
            type="button"
            onClick={() => setSeriesOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-4 text-sm font-bold text-gray-800 hover:text-primary transition-colors"
          >
            Product Series
            <ChevronDown
              size={15}
              className={`text-gray-400 transition-transform duration-200 ${seriesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {seriesOpen && (
            <div className="px-5 pb-4 space-y-2.5">
              {allSeries.map((s) => {
                const count = products.filter((p) => p.series === s).length;
                const checked = selectedSeries.includes(s);
                return (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center justify-between gap-2 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        onClick={() => onSeriesChange(s)}
                        className={`size-4 shrink-0 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          checked
                            ? "border-primary bg-primary"
                            : "border-gray-300 group-hover:border-primary"
                        }`}
                      >
                        {checked && (
                          <svg viewBox="0 0 10 8" className="size-2.5 text-white fill-current">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span
                        onClick={() => onSeriesChange(s)}
                        className={`text-xs font-medium transition-colors ${
                          checked ? "text-primary" : "text-gray-600 group-hover:text-gray-900"
                        }`}
                      >
                        {s.replace(" Series", "").replace("Signature ", "")}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div>
          <button
            type="button"
            onClick={() => setPriceOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-4 text-sm font-bold text-gray-800 hover:text-primary transition-colors"
          >
            Price Range
            <ChevronDown
              size={15}
              className={`text-gray-400 transition-transform duration-200 ${priceOpen ? "rotate-180" : ""}`}
            />
          </button>
          {priceOpen && (
            <div className="px-5 pb-5 space-y-2">
              {priceRanges.map((r, i) => (
                <label
                  key={r.label}
                  className="flex cursor-pointer items-center gap-2.5 group"
                >
                  <div
                    onClick={() => onPriceRangeChange(i)}
                    className={`size-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      priceRange === i
                        ? "border-primary"
                        : "border-gray-300 group-hover:border-primary"
                    }`}
                  >
                    {priceRange === i && (
                      <div className="size-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span
                    onClick={() => onPriceRangeChange(i)}
                    className={`text-xs font-medium transition-colors ${
                      priceRange === i ? "text-primary font-semibold" : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {r.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export function CatalogPage() {
  const products = useProducts();
  const [show, setShow] = useState(12);
  const [cols, setCols] = useState(4);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gridRef, gridVisible] = useStaggerAnimation<HTMLDivElement>();

  const activeFilterCount =
    selectedSeries.length + (priceRange !== 0 ? 1 : 0);

  const handleSeriesChange = (s: string) => {
    setSelectedSeries((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
    setPage(1);
  };

  const handlePriceRangeChange = (i: number) => {
    setPriceRange(i);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedSeries([]);
    setPriceRange(0);
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    const { min, max } = priceRanges[priceRange];
    let result = products.filter((p) => {
      const seriesMatch =
        selectedSeries.length === 0 || selectedSeries.includes(p.series);
      const priceMatch = p.price >= min && p.price <= max;
      return seriesMatch && priceMatch;
    });

    if (sortBy === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "high") result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [selectedSeries, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / show);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * show,
    page * show
  );

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

  const sidebarProps = {
    selectedSeries,
    onSeriesChange: handleSeriesChange,
    priceRange,
    onPriceRangeChange: handlePriceRangeChange,
    onClear: handleClearFilters,
    activeCount: activeFilterCount,
    products,
  };

  return (
    <div className="container-page py-8">
      {/* Page Header */}
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

        <div
          className="flex flex-wrap items-center gap-4 anim-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {/* Mobile filter toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-primary hover:text-primary lg:hidden"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>

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
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-gray-700 shadow-sm outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="default">Default sorting</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative ml-0 w-72 overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-bold text-gray-900">Filters</span>
              <button type="button" onClick={() => setSidebarOpen(false)}>
                <X size={18} className="text-gray-500 hover:text-primary" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar {...sidebarProps} />
            </div>
          </div>
        </div>
      )}

      {/* Main layout: sidebar + products */}
      <div className="flex gap-8 items-start">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar {...sidebarProps} />
        </div>

        {/* Products area */}
        <div className="flex-1 min-w-0">
          {/* Result count + active filters */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              product{filteredProducts.length !== 1 ? "s" : ""}
            </span>

            {selectedSeries.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSeriesChange(s)}
                className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                {s.replace(" Series", "").replace("Signature ", "")}
                <X size={11} />
              </button>
            ))}

            {priceRange !== 0 && (
              <button
                type="button"
                onClick={() => { setPriceRange(0); setPage(1); }}
                className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                {priceRanges[priceRange].label}
                <X size={11} />
              </button>
            )}

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-gray-400 hover:text-primary underline transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center rounded-2xl bg-surface border border-border">
              <p className="text-gray-500 font-medium">
                No products match the selected filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-sm font-bold text-primary underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              ref={gridRef}
              className={`grid grid-cols-1 gap-6 ${gridClass} animate-on-scroll animate-scale ${gridVisible ? "animate-visible" : ""}`}
            >
              {paginatedProducts.map((p, i) => (
                <div
                  key={p.slug}
                  className={`animate-on-scroll animate-scale ${gridVisible ? "animate-visible" : ""}`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2 text-sm">
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="grid size-9 place-items-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
