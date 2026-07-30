import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Logo } from "./ProductCard";
import { useCart } from "@/lib/cart";
import { formatPrice, products } from "@/lib/products";
import { useScrolled } from "@/hooks/useScrolled";

const nav = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/contact", label: "Contact" },
] as const;

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  if (!open || typeof document === "undefined") return null;

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Search Input Header */}
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
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-200"
          >
            <X size={14} />
            ESC
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {!query.trim() ? (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Popular Searches
              </p>
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
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Products ({results.length})
              </p>
              <div className="grid gap-2">
                {results.map((product) => (
                  <Link
                    key={product.slug}
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    onClick={onClose}
                    className="group flex items-center gap-4 rounded-xl border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-12 shrink-0 rounded-lg bg-surface object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500">{product.series}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <p className="text-[11px] text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm font-semibold text-gray-900">No products found</p>
              <p className="mt-1 text-xs text-gray-500">
                No research compounds matched "{query}". Try another search term.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function AuthDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Side Popup Drawer */}
      <div className="relative z-10 flex h-screen w-full max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white p-5">
          <h2 className="text-xl font-bold text-gray-900">
            {isRegister ? "Create An Account" : "Sign in"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-semibold text-gray-700 transition-colors hover:text-primary"
          >
            <X size={16} />
            Close
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isRegister ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800">
                  Username or email address <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-focus-ring mt-1.5 w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800">
                  Password <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-focus-ring w-full rounded-full border border-gray-300 px-4 py-2.5 pr-10 text-sm outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
              >
                Log In
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Remember me
                </label>
                <a href="#" className="font-medium text-gray-600 hover:text-primary transition-colors">
                  Lost your password?
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800">
                  Email address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-focus-ring mt-1.5 w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800">
                  Password <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-focus-ring w-full rounded-full border border-gray-300 px-4 py-2.5 pr-10 text-sm outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
              >
                Register
              </button>
            </form>
          )}

          {/* Bottom Switcher Card */}
          <div className="mt-8 border-t border-gray-100 pt-8 text-center">
            <div className="mx-auto mb-3 grid size-16 place-items-center rounded-full bg-gray-100/80 text-gray-300">
              <User size={32} strokeWidth={1.5} />
            </div>
            {!isRegister ? (
              <>
                <p className="text-base font-bold text-gray-900">No account yet?</p>
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="mt-2 inline-block text-xs font-bold text-gray-900 underline underline-offset-4 transition-colors hover:text-primary"
                >
                  Create An Account
                </button>
              </>
            ) : (
              <>
                <p className="text-base font-bold text-gray-900">Already have an account?</p>
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="mt-2 inline-block text-xs font-bold text-gray-900 underline underline-offset-4 transition-colors hover:text-primary"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, subtotal } = useCart();
  const scrolled = useScrolled(20);

  // Cart badge bounce animation
  const [badgeBounce, setBadgeBounce] = useState(false);
  const prevCount = useRef(count);
  useEffect(() => {
    if (count > prevCount.current) {
      setBadgeBounce(true);
      const t = setTimeout(() => setBadgeBounce(false), 500);
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border backdrop-blur transition-all duration-300 ${
        scrolled
          ? "header-scrolled"
          : "bg-background/95"
      }`}
    >
      <div className="container-page grid h-[70px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-3">
        <Link to="/" className="flex min-w-0 items-center">
          <Logo className="h-7 sm:h-8" />
        </Link>

        <nav className="hidden items-center justify-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{
                className: "text-primary nav-link-animated active",
              }}
              inactiveProps={{ className: "text-foreground" }}
              className="nav-link-animated text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="group hidden items-center justify-center md:flex"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[rgb(94,113,128)]/20 text-[rgb(94,113,128)] transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
              <Search size={16} />
            </span>
          </button>
          <button
            type="button"
            aria-label="Login / Register"
            onClick={() => setAuthOpen(true)}
            className="group hidden items-center justify-center md:flex"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[rgb(94,113,128)]/20 text-[rgb(94,113,128)] transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
              <User size={16} />
            </span>
          </button>
          <Link to="/cart" className="group flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
            <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-[rgb(94,113,128)]/20 text-[rgb(94,113,128)] transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
              <ShoppingCart size={16} />
              <span
                className={`absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ${
                  badgeBounce ? "anim-badge-bounce" : ""
                }`}
              >
                {count}
              </span>
            </span>
            {formatPrice(subtotal)}
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="lg:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] lg:hidden flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex h-full w-72 flex-col gap-2 bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="mb-4 self-end rounded-full p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 hover:rotate-90 duration-300"
            >
              <X size={22} />
            </button>
            <div className="flex-1 overflow-y-auto">
              {nav.map((item, i) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "text-primary bg-primary/5" }}
                  className="block rounded-lg px-4 py-3 text-base font-bold text-gray-800 transition-colors hover:bg-gray-50 hover:text-primary anim-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-4 h-px w-full bg-gray-100" />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSearchOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-bold text-gray-800 transition-colors hover:bg-gray-50 hover:text-primary anim-fade-in-up"
                style={{ animationDelay: "240ms" }}
              >
                <Search size={18} />
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setAuthOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-bold text-gray-800 transition-colors hover:bg-gray-50 hover:text-primary anim-fade-in-up"
                style={{ animationDelay: "320ms" }}
              >
                <User size={18} />
                Login / Register
              </button>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="mt-4 flex w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg anim-fade-in-up"
                style={{ animationDelay: "400ms" }}
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Cart
                </span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {count}
                </span>
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Auth Side Drawer Popup */}
      <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
