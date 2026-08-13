import { useEffect, useState } from "react";
import {
  ClockIcon,
  Heart,
  LogOut,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import { useAuth, AUTH_API } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { formatPrice, products as allProducts } from "@/lib/products";
import { Link, navigateTo } from "@/lib/router";

type OrderItem = { product_name: string; size: string; quantity: number; unit_price: number };
type Order = {
  id: number;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
};

const STATUS_LABEL: Record<string, string> = {
  pending:   "Pending",
  approved:  "Confirmed",
  shipped:   "Shipped",
  delivered: "Delivered",
  rejected:  "Cancelled",
};

const STATUS_COLOR: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  approved:  "bg-emerald-100 text-emerald-800",
  shipped:   "bg-blue-100 text-blue-800",
  delivered: "bg-gray-100 text-gray-700",
  rejected:  "bg-red-100 text-red-700",
};

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-gray-50/60 transition-colors"
      >
        <div className="min-w-0">
          <p className="font-bold text-sm text-foreground">{order.order_number}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            })}
            {" · "}
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"}`}>
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
          <span className="font-bold text-sm text-primary">{formatPrice(Number(order.total))}</span>
          <span className="text-xs text-muted-foreground">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-foreground">
                {item.product_name}
                {item.size && <span className="ml-1 text-xs text-muted-foreground">({item.size})</span>}
                {" ×"}{item.quantity}
              </span>
              <span className="font-semibold">{formatPrice(Number(item.unit_price) * item.quantity)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AccountPage() {
  const { customer, logout, token, isLoggedIn } = useAuth();
  const { items, count, subtotal, wishlist } = useCart();

  const [past, setPast]       = useState<Order[]>([]);
  const [upcoming, setUpcoming] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError]     = useState("");

  useEffect(() => {
    if (!isLoggedIn) { navigateTo("/login"); return; }

    (async () => {
      try {
        const res  = await fetch(`${AUTH_API}/account/orders.php`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setPast(data.data.past);
          setUpcoming(data.data.upcoming);
        } else {
          setOrdersError("Could not load orders.");
        }
      } catch {
        setOrdersError("Network error loading orders.");
      } finally {
        setOrdersLoading(false);
      }
    })();
  }, [isLoggedIn, token]);

  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.slug));

  const handleLogout = async () => {
    await logout();
    navigateTo("/");
  };

  if (!isLoggedIn) return null;

  return (
    <div className="container-page py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-full bg-[#1B3A5C] text-white text-lg font-bold">
            {customer?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold">Hello, {customer?.name}</h1>
            <p className="text-sm text-muted-foreground">{customer?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-red-300 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column - Orders */}
        <div className="lg:col-span-2 space-y-8">

          {/* Upcoming Orders */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <ClockIcon size={18} className="text-[#1B3A5C]" />
              <h2 className="text-base font-bold">Upcoming Orders</h2>
              {upcoming.length > 0 && (
                <span className="ml-1 rounded-full bg-[#1B3A5C] px-2 py-0.5 text-[11px] font-bold text-white">
                  {upcoming.length}
                </span>
              )}
            </div>
            {ordersLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : ordersError ? (
              <p className="text-sm text-red-600">{ordersError}</p>
            ) : upcoming.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No upcoming orders
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((o) => <OrderCard key={o.id} order={o} />)}
              </div>
            )}
          </section>

          {/* Past Orders */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Package size={18} className="text-[#1B3A5C]" />
              <h2 className="text-base font-bold">Order History</h2>
            </div>
            {ordersLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : past.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No past orders
              </div>
            ) : (
              <div className="space-y-3">
                {past.map((o) => <OrderCard key={o.id} order={o} />)}
              </div>
            )}
          </section>
        </div>

        {/* Right column - Wishlist + Cart */}
        <div className="space-y-6">

          {/* Cart Summary */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={17} className="text-[#1B3A5C]" />
                <h2 className="text-sm font-bold">My Cart</h2>
              </div>
              {count > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </div>
            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground">Your cart is empty.</p>
            ) : (
              <div className="space-y-2.5">
                {items.map((i) => (
                  <div key={`${i.slug}-${i.size}`} className="flex items-center gap-2.5 text-xs">
                    <img src={i.image} alt={i.name} className="size-9 rounded-lg object-cover bg-surface shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{i.name}</p>
                      <p className="text-muted-foreground">{i.size} × {i.qty}</p>
                    </div>
                    <span className="font-semibold shrink-0">{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
                <Link
                  to="/cart"
                  className="block w-full rounded-full bg-primary py-2.5 text-center text-xs font-bold text-white shadow transition-all hover:opacity-90"
                >
                  Go to Cart
                </Link>
              </div>
            )}
          </section>

          {/* Wishlist */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Heart size={17} className="text-[#1B3A5C]" />
              <h2 className="text-sm font-bold">Wishlist</h2>
              {wishlist.length > 0 && (
                <span className="rounded-full bg-[#1B3A5C] px-2 py-0.5 text-[11px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </div>
            {wishlistProducts.length === 0 ? (
              <p className="text-xs text-muted-foreground">No saved items yet.</p>
            ) : (
              <div className="space-y-2.5">
                {wishlistProducts.map((p) => (
                  <Link
                    key={p.slug}
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    className="flex items-center gap-2.5 rounded-lg p-1.5 text-xs transition-colors hover:bg-gray-50"
                  >
                    <img src={p.image} alt={p.name} className="size-9 rounded-lg object-cover bg-surface shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-muted-foreground">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Account Info */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <User size={17} className="text-[#1B3A5C]" />
              <h2 className="text-sm font-bold">Account</h2>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Name:</span> {customer?.name}</p>
              <p><span className="font-medium text-foreground">Email:</span> {customer?.email}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
