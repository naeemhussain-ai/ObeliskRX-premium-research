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
        <div className="rounded-lg bg-card p-4 shadow-card sm:p-6">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">Your cart is currently empty.</p>
              <Link
                to="/catalog"
                className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
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
                      <th className="pb-3 font-medium" colSpan={2}>
                        Product
                      </th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium">Quantity</th>
                      <th className="pb-3 text-right font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={`${item.slug}-${item.size}`} className="border-b border-border">
                        <td className="py-5 pr-3 align-middle">
                          <button
                            type="button"
                            aria-label="Remove item"
                            onClick={() => remove(item.slug, item.size)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <X size={16} />
                          </button>
                        </td>
                        <td className="py-5 pr-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="size-12 shrink-0 rounded bg-surface object-cover"
                            />
                            <span className="truncate">
                              {item.name} - {item.size}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 text-muted-foreground">{formatPrice(item.price)}</td>
                        <td className="py-5">
                          <QtyInput
                            value={item.qty}
                            onChange={(q) => setQty(item.slug, item.size, q)}
                          />
                        </td>
                        <td className="py-5 text-right font-semibold">
                          {formatPrice(item.price * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="w-52 rounded-full border border-border px-4 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Apply Coupon
                </button>
              </div>
            </>
          )}
        </div>

        <aside className="h-fit rounded-lg bg-card p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="mb-4 text-xl font-bold">Cart Totals</h2>
          <div className="flex items-center justify-between border-b border-border py-3 text-sm">
            <span>Subtotal</span>
            <span className="text-muted-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between border-b border-border py-3 text-sm">
            <span>Total</span>
            <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
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
