import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { formatPrice, products } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart — ObeliskRX" },
      {
        name: "description",
        content: "Review the research peptides in your ObeliskRX cart and proceed to checkout.",
      },
      { property: "og:title", content: "Shopping Cart — ObeliskRX" },
      { property: "og:description", content: "Review your ObeliskRX cart and checkout securely." },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, setQty, subtotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const suggestions = products.slice(0, 5);

  return (
    <div className="container-page py-8">
      <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground underline underline-offset-8">
          Shopping cart
        </span>
        <span>→</span>
        <span>Checkout</span>
        <span>→</span>
        <span>Order complete</span>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-[7fr_3fr]">
        <div className="rounded-2xl bg-card p-4 shadow-card sm:p-8">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-base text-muted-foreground">Your cart is currently empty.</p>
              <Link
                to="/catalog"
                className="mt-6 inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:opacity-90 hover:-translate-y-0.5"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-125 text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-4 font-semibold uppercase tracking-wider text-xs" colSpan={2}>
                        Product
                      </th>
                      <th className="pb-4 font-semibold uppercase tracking-wider text-xs">Price</th>
                      <th className="pb-4 font-semibold uppercase tracking-wider text-xs">Quantity</th>
                      <th className="pb-4 text-right font-semibold uppercase tracking-wider text-xs">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={`${item.slug}-${item.size}`} className="border-b border-border transition-colors hover:bg-gray-50/50">
                        <td className="py-6 pr-3 align-middle">
                          <button
                            type="button"
                            aria-label="Remove item"
                            onClick={() => remove(item.slug, item.size)}
                            className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </td>
                        <td className="py-6 pr-4">
                          <div className="flex min-w-0 items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="size-16 shrink-0 rounded-lg bg-surface object-cover shadow-sm"
                            />
                            <span className="truncate font-semibold text-gray-900">
                              {item.name} <span className="ml-1 text-xs font-normal text-muted-foreground border border-border rounded-full px-2 py-0.5">{item.size}</span>
                            </span>
                          </div>
                        </td>
                        <td className="py-6 font-medium text-gray-900">{formatPrice(item.price)}</td>
                        <td className="py-6">
                          <QtyInput
                            value={item.qty}
                            onChange={(q) => setQty(item.slug, item.size, q)}
                          />
                        </td>
                        <td className="py-6 text-right font-bold text-gray-900">
                          {formatPrice(item.price * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="w-64 rounded-full border border-border bg-surface px-5 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
                />
                <button
                  type="button"
                  className="rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-black hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Apply Coupon
                </button>
              </div>
            </>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-card p-6 shadow-card sm:p-8 lg:sticky lg:top-24 border border-primary/10">
          <h2 className="mb-6 text-xl font-bold">Cart Totals</h2>
          <div className="flex items-center justify-between border-b border-border py-4 text-sm">
            <span className="font-medium text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between py-4 text-sm">
            <span className="font-medium text-gray-600">Total</span>
            <span className="text-2xl font-black text-primary">{formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            className="mt-6 w-full rounded-full bg-primary py-4 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Proceed To Checkout
          </button>
        </aside>
      </div>

      <section className="py-16">
        <h2 className="mb-6 text-2xl font-bold">You May Be Interested In...</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {suggestions.map((p) => (
            <ProductCard key={p.slug} product={p} compact />
          ))}
        </div>
      </section>
    </div>
  );
}

function QtyInput({ value, onChange }: { value: number; onChange: (q: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-border">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        className="px-3 py-1.5 text-muted-foreground hover:text-primary"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-8 text-center text-sm">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="px-3 py-1.5 text-muted-foreground hover:text-primary"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
