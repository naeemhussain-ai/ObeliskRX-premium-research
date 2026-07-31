import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, X } from "lucide-react";

export type CartItem = {
  slug: string;
  name: string;
  size: string;
  price: number;
  image: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => boolean;
  remove: (slug: string, size: string) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  is21Plus: boolean;
  setAgeVerified: (verified: boolean) => void;
  showAgeNoticeModal: boolean;
  setShowAgeNoticeModal: (show: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "obeliskrx-cart";
const WISH_KEY = "obeliskrx-wishlist";
const AGE_KEY = "obelisk_verified_21";

function ElderPermissionModal({
  open,
  onClose,
  onVerify,
}: {
  open: boolean;
  onClose: () => void;
  onVerify: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-border">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
          <AlertTriangle size={28} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900">Age Restriction Notice</h3>
        
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          You are not 21 years old. Please take permission from your elders (who are 21+) before adding medications or research products to cart.
        </p>

        <div className="mt-4 rounded-xl bg-amber-50 p-3.5 border border-amber-200/80 text-left">
          <p className="text-xs font-semibold text-amber-900">
            ⚠️ Notice / Meherbani Farmayein:
          </p>
          <p className="mt-1 text-xs text-amber-800 leading-relaxed">
            You are not 21 years old. Please take permission from your elders who are 21+.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
          >
            Continue Browsing
          </button>

          <button
            type="button"
            onClick={() => {
              onVerify();
              onClose();
            }}
            className="w-full sm:flex-1 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-all active:scale-95"
          >
            I Am 21 Or Older
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [is21Plus, setIs21Plus] = useState(false);
  const [showAgeNoticeModal, setShowAgeNoticeModal] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const w = localStorage.getItem(WISH_KEY);
      if (w) setWishlist(JSON.parse(w));
      const ageVal = localStorage.getItem(AGE_KEY);
      if (ageVal === "true") setIs21Plus(true);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const setAgeVerified = useCallback((verified: boolean) => {
    setIs21Plus(verified);
    localStorage.setItem(AGE_KEY, verified ? "true" : "false");
  }, []);

  const add = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1): boolean => {
      // IF-ELSE Age Verification Condition
      const verifiedInStorage = localStorage.getItem(AGE_KEY) === "true";

      if (!verifiedInStorage) {
        // User is not 21 years old! Block add to cart and prompt for elder permission
        setShowAgeNoticeModal(true);
        return false;
      }

      // If user IS 21+, proceed normally with adding to cart
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.slug === item.slug && i.size === item.size);
        if (idx > -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...prev, { ...item, qty }];
      });
      return true;
    },
    [],
  );

  const remove = useCallback((slug: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)));
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setItems((prev) =>
      prev.flatMap((i) =>
        i.slug === slug && i.size === size ? (qty <= 0 ? [] : [{ ...i, qty }]) : [i],
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      add,
      remove,
      setQty,
      clear,
      wishlist,
      toggleWishlist,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
      is21Plus,
      setAgeVerified,
      showAgeNoticeModal,
      setShowAgeNoticeModal,
    }),
    [
      items,
      add,
      remove,
      setQty,
      clear,
      wishlist,
      toggleWishlist,
      is21Plus,
      setAgeVerified,
      showAgeNoticeModal,
      setShowAgeNoticeModal,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <ElderPermissionModal
        open={showAgeNoticeModal}
        onClose={() => setShowAgeNoticeModal(false)}
        onVerify={() => setAgeVerified(true)}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

