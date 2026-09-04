import { useState } from "react";
import { Heart, Search, ShoppingCart, X, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Link } from "@/lib/router";
import { useToast } from "@/hooks/useToast";
import { formatPrice, priceLabel, type Product } from "@/lib/products";

export function Logo({ className = "h-8", light = false }: { className?: string; light?: boolean }) {
  const textColor = light ? "#ffffff" : "#0B1F3A";
  return (
    <svg
      viewBox="0 0 312 56"
      className={`${className} w-auto`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ObeliskRX"
      role="img"
    >
      <defs>
        <linearGradient id="__obrxGrad" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#5b8fd4" />
          <stop offset="45%" stopColor="#3a4878" />
          <stop offset="100%" stopColor="#7a3218" />
        </linearGradient>
      </defs>
      {/* Blue arc "“ left */}
      <path d="M 28,8 A 20,22 0 0,0 28,52"
        fill="none" stroke="#174A7E" strokeWidth="5.5" strokeLinecap="round" />
      {/* Orange arc "“ right */}
      <path d="M 28,8 A 20,22 0 0,1 28,52"
        fill="none" stroke="#F47A38" strokeWidth="5.5" strokeLinecap="round" />
      {/* Obelisk */}
      <polygon points="28,1 30.5,13 34,53 22,53 25.5,13" fill="url(#__obrxGrad)" />
      {/* OBELISK */}
      <text x="66" y="41"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900" fontSize="36" fill={textColor} letterSpacing="1.5">
        OBELISK
      </text>
      {/* Rx */}
      <text x="262" y="41"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700" fontSize="29" fill="#F47A38">
        Rx
      </text>
    </svg>
  );
}

function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { add } = useCart();
  const { addToast } = useToast();
  const [size, setSize] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    const selectedSize = size || product.sizes[0];
    add(
      {
        slug: product.slug,
        name: product.name,
        size: selectedSize,
        price: product.price,
        image: product.image,
      },
      1,
    );
    addToast({
      message: "Added to cart",
      subtitle: `${product.name} - ${selectedSize}`,
      type: "success",
      image: product.image,
    });
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
        >
          <X size={16} />
          Close
        </button>

        {/* Product Image */}
        <div className="flex items-center justify-center bg-gray-50 px-8 pb-4 pt-12">
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-48 object-contain"
          />
        </div>

        {/* Size Selector */}
        <div className="px-6 pb-2 pt-4 text-center">
          <p className="mb-3 text-base font-bold text-gray-900">Size:</p>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="mx-auto w-full max-w-[220px] rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-primary"
          >
            <option value="">Choose an option</option>
            {product.sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Add To Cart Button */}
        <div className="px-6 pb-4 pt-4">
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${
              isAdding ? "bg-emerald-500 scale-105" : "bg-primary hover:bg-primary/90 hover:-translate-y-0.5"
            }`}
          >
            {isAdding ? (
              <>
                <Check size={18} className="anim-bounce-in" /> Added
              </>
            ) : (
              "Add To Cart"
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="border-t border-gray-100 px-6 py-4">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            onClick={onClose}
            className="text-sm font-semibold text-foreground hover:text-primary"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">{product.series}</p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {product.oldPrice && (
              <span className="mr-2 text-xs font-normal text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            {priceLabel(product)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { wishlist, toggleWishlist } = useCart();
  const { addToast } = useToast();
  const wished = wishlist.includes(product.slug);
  const [showModal, setShowModal] = useState(false);

  const handleWishlist = () => {
    toggleWishlist(product.slug);
    addToast({
      message: wished ? "Removed from wishlist" : "Added to wishlist",
      subtitle: product.name,
      type: wished ? "info" : "success",
      image: product.image,
    });
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover-lift">
        <div className="relative overflow-hidden">
          <span className="discount-badge absolute left-0 top-0 z-10 rounded-br-lg bg-discount px-2.5 py-1 text-[11px] font-bold text-discount-foreground shadow-sm">
            -{product.discount}%
          </span>
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={handleWishlist}
            className="absolute right-2 top-2 z-10 rounded-full bg-background/90 p-1.5 text-muted-foreground shadow-sm backdrop-blur transition-all duration-300 hover:bg-white hover:text-primary hover:scale-110 active:scale-95"
          >
            <Heart size={16} className={`transition-all duration-300 ${wished ? "fill-primary text-primary anim-heart-pop" : ""}`} />
          </button>
          <Link to="/product/$slug" params={{ slug: product.slug }} className="block overflow-hidden">
            <img
              src={product.image}
              alt={`${product.name} research peptide vial`}
              loading="lazy"
              decoding="async"
              className="aspect-[2/3] w-full bg-surface object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </Link>

          {/* Hover slide-up bar: "Select Options" + search icon */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex translate-y-[120%] items-center gap-2 bg-gradient-to-t from-black/40 to-transparent p-3 pt-6 transition-all duration-300 ease-out group-hover:translate-y-0 opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart size={14} />
              Select Options
            </button>
            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-gray-700 shadow-md transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg active:scale-95"
            >
              <Search size={14} />
            </Link>
          </div>
        </div>
        <div className={`bg-[#0B1F3A] transition-colors duration-300 group-hover:bg-[#0d1631] ${compact ? "p-3" : "p-4"}`}>
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="text-sm font-semibold text-white hover:text-primary"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-xs text-white/60">{product.series}</p>
          <p className="mt-2 text-sm font-bold text-white">
            {product.oldPrice && (
              <span className="mr-2 text-xs font-normal text-white/50 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            {priceLabel(product)}
          </p>
        </div>
      </div>

      {/* Quick View Modal */}
      {showModal && (
        <QuickViewModal product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}


