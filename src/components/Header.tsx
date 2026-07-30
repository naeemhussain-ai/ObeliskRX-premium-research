import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Logo } from "./ProductCard";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

const nav = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/contact", label: "Contact" },
  { to: "/research-articles", label: "Research Articles" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { count, subtotal } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
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
                className: "text-primary underline underline-offset-8 decoration-2",
              }}
              inactiveProps={{ className: "text-foreground" }}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="hidden items-center gap-2 text-sm text-foreground hover:text-primary md:flex"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-ink-foreground">
              <Search size={16} />
            </span>
            Search
          </button>
          <button
            type="button"
            className="hidden items-center gap-2 text-sm text-foreground hover:text-primary md:flex"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-ink-foreground">
              <User size={16} />
            </span>
            Login / Register
          </button>
          <Link to="/cart" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
            <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-ink text-ink-foreground">
              <ShoppingCart size={16} />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
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

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col gap-2 bg-background p-6 shadow-card-hover">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="mb-4 self-end"
            >
              <X size={22} />
            </button>
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="rounded-md px-2 py-3 text-base font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 text-base font-medium hover:bg-muted"
            >
              Cart ({count})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
