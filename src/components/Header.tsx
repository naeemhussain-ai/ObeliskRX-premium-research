import { useState } from "react";
import { createPortal } from "react-dom";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Logo } from "./ProductCard";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { getProducts } from "@/lib/products";
import { Link } from "@/lib/router";
import { useScrolled } from "@/hooks/useScrolled";
import { useCurrentPath } from "@/lib/router";

type NavLink = { to: string; label: string };

const nav: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Products" },
  { to: "/about", label: "Quality" },
  { to: "/research-articles", label: "Research" },
  { to: "/coa", label: "COAs" },
  { to: "/contact", label: "Contact" },
];

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  if (!open || typeof document === "undefined") return null;

  const products = getProducts();
  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.series.toLowerCase().includes(query.toLowerCase()) ||
          p.slug.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const popularTags = ["BPC-157", "Semax", "Metabolic", "Epithalon", "Growth Series"];

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-start justify-center px-4 pt-16 sm:pt-24">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <Search size={20} className="shrink-0 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search peptides, series, compounds..."
            autoFocus
            className="w-full text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-xs font-semibold text-gray-400 hover:text-gray-600">
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200"
          >
            <X size={14} /> ESC
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {!query.trim() ? (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary hover:scale-[1.03]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Products ({results.length})</p>
              <div className="grid gap-2">
                {results.map((product) => (
                  <Link
                    key={product.slug}
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    onClick={onClose}
                    className="group flex items-center gap-4 rounded-xl border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                  >
                    <img src={product.image} alt={product.name} className="size-12 shrink-0 rounded-lg bg-surface object-cover" />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-gray-900 group-hover:text-primary">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.series}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm font-semibold text-gray-900">No products found</p>
              <p className="mt-1 text-xs text-gray-500">No compounds matched "{query}".</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const { isLoggedIn, customer } = useAuth();
  const scrolled = useScrolled(10);
  const currentPath = useCurrentPath();
  const isHome = currentPath === "/";
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-b border-white/10"
          : "bg-white/95 backdrop-blur-sm border-b border-border shadow-sm"
      }`}
    >
      <div className="container-page grid h-[68px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">

        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center">
          <Logo className="h-10 sm:h-11" light={isTransparent} />
        </Link>

        {/* Desktop Nav   centered */}
        <nav className="hidden items-center justify-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: isTransparent ? "text-white font-semibold" : "text-primary font-semibold" }}
              inactiveProps={{ className: isTransparent ? "text-white/85" : "text-foreground" }}
              className={`text-sm font-medium transition-colors duration-200 ${
                isTransparent ? "hover:text-white" : "hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side   View Catalog + small icons */}
        <div className="flex items-center justify-end gap-2">
          {/* Search icon */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className={`hidden md:grid size-9 place-items-center rounded-full transition-all duration-200 ${
              isTransparent
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <Search size={16} />
          </button>

          {/* Account icon */}
          <Link
            to={isLoggedIn ? "/account" : "/login"}
            aria-label={isLoggedIn ? "My Account" : "Sign In"}
            className={`hidden md:grid size-9 place-items-center rounded-full transition-all duration-200 relative ${
              isTransparent
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {isLoggedIn ? (
              <span className="text-[11px] font-bold">{customer?.name?.[0]?.toUpperCase()}</span>
            ) : (
              <User size={16} />
            )}
            {isLoggedIn && (
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-emerald-500 border border-white" />
            )}
          </Link>

          {/* Cart icon */}
          <Link
            to="/cart"
            aria-label="Cart"
            className={`hidden md:grid size-9 place-items-center rounded-full transition-all duration-200 relative ${
              isTransparent
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <ShoppingCart size={16} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          {/* View Catalog CTA   outline only, no background */}
          <Link
            to="/catalog"
            className={`hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold border transition-all duration-200 rounded-none ${
              isTransparent
                ? "border-white text-white hover:bg-white/10"
                : "border-[#0B1F3A] text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white"
            }`}
          >
            View Catalog
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className={`lg:hidden transition-colors ${isTransparent ? "text-white" : "text-foreground"}`}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] lg:hidden flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex h-full w-72 flex-col bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="mb-6 self-end rounded-full p-2 text-gray-500 hover:bg-gray-100"
            >
              <X size={22} />
            </button>
            <div className="flex-1 space-y-1 overflow-y-auto">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-primary bg-primary/5" }}
                  className="block rounded-lg px-4 py-3 text-base font-semibold text-gray-800 transition-colors hover:bg-gray-50 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-3 h-px bg-gray-100" />
              <Link
                to={isLoggedIn ? "/account" : "/login"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary"
              >
                <User size={18} />
                {isLoggedIn ? `My Account (${customer?.name})` : "Sign In / Register"}
              </Link>
              <button
                type="button"
                onClick={() => { setOpen(false); setSearchOpen(true); }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary"
              >
                <Search size={18} />
                Search
              </button>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="mt-2 flex w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-base font-bold text-primary-foreground shadow-md hover:bg-[#D96529]"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Cart
                </span>
                {count > 0 && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{count}</span>
                )}
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
