import { useState, useEffect } from "react";
import { Minus, Plus, X, Package, CheckCircle2, LogIn, UserPlus, UserCheck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { Link, navigateTo } from "@/lib/router";
import { formatPrice, getProducts } from "@/lib/products";

const API = import.meta.env.VITE_API_URL ?? "http://localhost/obeliskrx/api";

type Step = "cart" | "auth" | "checkout" | "success";

type CheckoutForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  special_notes: string;
};

const EMPTY: CheckoutForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  special_notes: "",
};

export function CartPage() {
  const products = getProducts();
  const { items, remove, setQty, subtotal, clear } = useCart();
  const { customer, isLoggedIn, token } = useAuth();
  const [coupon, setCoupon] = useState("");
  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState<CheckoutForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const suggestions = products.slice(0, 5);

  // Jab checkout step pe aao aur logged in ho, profile se form pre-fill karo
  useEffect(() => {
    if (step !== "checkout" || !isLoggedIn || !token) return;

    fetch(`${API}/auth/me.php`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return;
        const p = data.data.customer;
        const [firstName = "", ...rest] = (p.name ?? "").trim().split(" ");
        const lastName = rest.join(" ");
        setForm((prev) => ({
          ...prev,
          first_name:    firstName,
          last_name:     lastName,
          email:         p.email         ?? prev.email,
          phone:         p.phone         ?? prev.phone,
          address_line1: p.address_line1 ?? prev.address_line1,
          address_line2: p.address_line2 ?? prev.address_line2,
          city:          p.city          ?? prev.city,
          state:         p.state         ?? prev.state,
          zip:           p.zip           ?? prev.zip,
          country:       p.country       ?? prev.country,
        }));
      })
      .catch(() => {});
  }, [step, isLoggedIn, token]);

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API}/orders/create.php`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            slug: i.slug,
            product_name: i.name,
            quantity: i.qty,
            unit_price: i.price,
            size: i.size,
          })),
          subtotal,
          total: subtotal,
          payment_method: "alipay",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.data.order_number);
        clear();
        setStep("success");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success ──────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-md text-center">
          <CheckCircle2 className="mx-auto text-emerald-500" size={72} />
          <h1 className="mt-6 text-3xl font-bold">Order Placed!</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you! Your order has been received and will be processed shortly.
          </p>
          <div className="mt-8 rounded-2xl bg-card p-6 shadow-card border border-primary/10">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Order Number
            </p>
            <p className="mt-2 text-3xl font-black text-primary">{orderNumber}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Save this number to track your order.
            </p>
          </div>
          <Link
            to="/catalog"
            className="mt-8 inline-block rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Auth Choice Step ──────────────────────────────────────────────────────
  if (step === "auth") {
    return (
      <div className="container-page py-8">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <button type="button" onClick={() => setStep("cart")} className="hover:text-primary transition-colors">
            Shopping cart
          </button>
          <span>&rsaquo;</span>
          <span className="font-semibold text-foreground underline underline-offset-8">Checkout</span>
          <span>&rsaquo;</span>
          <span>Order complete</span>
        </nav>

        <div className="mt-10 mx-auto max-w-2xl">
          <h2 className="mb-6 text-xl font-bold text-center">How would you like to continue?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Sign in / Account option */}
            <div className="rounded-2xl border-2 border-[#0B1F3A]/30 bg-card p-6 flex flex-col gap-4 shadow-sm hover:border-[#0B1F3A] transition-colors">
              <div className="grid size-11 place-items-center rounded-full bg-[#0B1F3A]/10 text-[#0B1F3A]">
                {isLoggedIn ? <UserCheck size={22} /> : <LogIn size={22} />}
              </div>
              {isLoggedIn ? (
                <>
                  <div>
                    <p className="font-bold text-base">Continue as {customer?.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{customer?.email}</p>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>&#10003; Order linked to your account</li>
                    <li>&#10003; Track status in My Account</li>
                    <li>&#10003; View full order history</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => setStep("checkout")}
                    className="mt-auto w-full rounded-full bg-[#0B1F3A] py-3 text-sm font-bold text-white shadow transition-all hover:bg-[#0d1631]"
                  >
                    Continue to Checkout
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-bold text-base">Sign in / Create Account</p>
                    <p className="text-xs text-muted-foreground mt-1">Track your orders &amp; save history</p>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>&#10003; View past &amp; upcoming orders</li>
                    <li>&#10003; Save your wishlist</li>
                    <li>&#10003; Faster future checkouts</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => navigateTo("/login")}
                    className="mt-auto w-full rounded-full bg-[#0B1F3A] py-3 text-sm font-bold text-white shadow transition-all hover:bg-[#0d1631]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <LogIn size={15} /> Sign In / Register
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Guest option */}
            <div className="rounded-2xl border-2 border-border bg-card p-6 flex flex-col gap-4 shadow-sm hover:border-gray-400 transition-colors">
              <div className="grid size-11 place-items-center rounded-full bg-gray-100 text-gray-500">
                <UserPlus size={22} />
              </div>
              <div>
                <p className="font-bold text-base">Continue as Guest</p>
                <p className="text-xs text-muted-foreground mt-1">No account needed</p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>&#10003; Quick &amp; easy checkout</li>
                <li>&#10003; No registration required</li>
                <li className="text-gray-400">&#10007; Can't track order in account</li>
              </ul>
              <button
                type="button"
                onClick={() => setStep("checkout")}
                className="mt-auto w-full rounded-full border-2 border-border py-3 text-sm font-bold text-foreground transition-all hover:border-gray-400"
              >
                Continue as Guest
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep("cart")}
            className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to cart
          </button>
        </div>
      </div>
    );
  }

  // ── Checkout Form ─────────────────────────────────────────────────────────
  if (step === "checkout") {
    return (
      <div className="container-page py-8">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => setStep("cart")}
            className="hover:text-primary transition-colors"
          >
            Shopping cart
          </button>
          <span>&rsaquo;</span>
          <span className="font-semibold text-foreground underline underline-offset-8">
            Checkout
          </span>
          <span>&rsaquo;</span>
          <span>Order complete</span>
        </nav>

        <form onSubmit={handleCheckout} className="mt-8 grid gap-8 lg:grid-cols-[7fr_3fr]">
          <div className="rounded-2xl bg-card p-6 shadow-card sm:p-8 space-y-5">
            <h2 className="text-xl font-bold">Shipping Details</h2>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="First Name *" name="first_name" value={form.first_name} onChange={handleField} required />
              <InputField label="Last Name *" name="last_name" value={form.last_name} onChange={handleField} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Email *" name="email" type="email" value={form.email} onChange={handleField} required />
              <InputField label="Phone *" name="phone" type="tel" value={form.phone} onChange={handleField} required />
            </div>
            <InputField label="Address Line 1 *" name="address_line1" value={form.address_line1} onChange={handleField} required />
            <InputField label="Address Line 2 (optional)" name="address_line2" value={form.address_line2} onChange={handleField} />
            <div className="grid gap-4 sm:grid-cols-3">
              <InputField label="City *" name="city" value={form.city} onChange={handleField} required />
              <InputField label="State *" name="state" value={form.state} onChange={handleField} required />
              <InputField label="ZIP *" name="zip" value={form.zip} onChange={handleField} required />
            </div>
            <InputField label="Country *" name="country" value={form.country} onChange={handleField} required />

            <div>
              <label className="mb-1.5 block text-sm font-medium">Special Notes (optional)</label>
              <textarea
                name="special_notes"
                value={form.special_notes}
                onChange={handleField}
                rows={3}
                placeholder="Any special instructions..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl bg-card p-6 shadow-card border border-primary/10 sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-3">
              {items.map((i) => (
                <div key={`${i.slug}-${i.size}`} className="flex items-center gap-3 text-sm">
                  <img
                    src={i.image}
                    alt={i.name}
                    className="size-10 shrink-0 rounded-lg bg-surface object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{i.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {i.size} &times; {i.qty}
                    </p>
                  </div>
                  <span className="font-semibold">{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-2xl font-black text-primary">{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                <Package size={14} className="shrink-0 text-primary" />
                Payment via AliPay on delivery
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary py-4 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Placing Order…" : "Place Order"}
            </button>

            <button
              type="button"
              onClick={() => setStep("cart")}
              className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to cart
            </button>
          </aside>
        </form>
      </div>
    );
  }

  // ── Cart View ─────────────────────────────────────────────────────────────
  return (
    <div className="container-page py-8 overflow-x-hidden">
      <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground underline underline-offset-8">
          Shopping cart
        </span>
        <span>&rsaquo;</span>
        <span>Checkout</span>
        <span>&rsaquo;</span>
        <span>Order complete</span>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-[7fr_3fr]">
        <div className="min-w-0 overflow-hidden rounded-2xl bg-card p-4 shadow-card sm:p-8">
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
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-4 font-semibold uppercase tracking-wider text-xs" colSpan={2}>
                        Product
                      </th>
                      <th className="pb-4 font-semibold uppercase tracking-wider text-xs">Price</th>
                      <th className="pb-4 font-semibold uppercase tracking-wider text-xs">Quantity</th>
                      <th className="pb-4 text-right font-semibold uppercase tracking-wider text-xs">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={`${item.slug}-${item.size}`}
                        className="border-b border-border transition-colors hover:bg-gray-50/50"
                      >
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
                              {item.name}{" "}
                              <span className="ml-1 text-xs font-normal text-muted-foreground border border-border rounded-full px-2 py-0.5">
                                {item.size}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="py-6 font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </td>
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

              {/* Mobile list */}
              <div className="flex flex-col divide-y divide-border sm:hidden">
                {items.map((item) => (
                  <div key={`${item.slug}-${item.size}`} className="py-4 flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-14 shrink-0 rounded-lg bg-surface object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-semibold text-gray-900 text-sm">{item.name}</p>
                      <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                        {item.size}
                      </span>
                      <div className="mt-2 flex items-center gap-3">
                        <QtyInput
                          value={item.qty}
                          onChange={(q) => setQty(item.slug, item.size, q)}
                        />
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => remove(item.slug, item.size)}
                      className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Code"
                  className="w-full sm:w-64 rounded-full border border-border bg-surface px-5 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
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

        <aside className="min-w-0 h-fit rounded-2xl bg-card p-6 shadow-card sm:p-8 lg:sticky lg:top-24 border border-primary/10">
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
            onClick={() => items.length > 0 && setStep(isLoggedIn ? "checkout" : "auth")}
            disabled={items.length === 0}
            className="mt-6 w-auto rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed To Checkout
          </button>
        </aside>
      </div>

      <section className="py-16">
        <h2 className="mb-6 text-2xl font-bold">You May Be Interested In…</h2>
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

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}


