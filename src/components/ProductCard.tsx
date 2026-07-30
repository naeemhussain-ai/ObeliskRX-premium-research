import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { useCart } from "@/lib/cart";
import { formatPrice, priceLabel, type Product } from "@/lib/products";

export function Logo({ className = "h-8", light = false }: { className?: string; light?: boolean }) {
  return (
    <img
      src={logo.url}
      alt="ObeliskRX"
      className={`${className} w-auto ${light ? "brightness-0 invert" : ""}`}
    />
  );
}

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { wishlist, toggleWishlist } = useCart();
  const wished = wishlist.includes(product.slug);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative">
        <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-discount px-2 py-1 text-[11px] font-bold text-discount-foreground">
          -{product.discount}%
        </span>
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => toggleWishlist(product.slug)}
          className="absolute right-2 top-2 z-10 rounded-full bg-background p-1.5 text-muted-foreground shadow-card transition-colors hover:text-primary"
        >
          <Heart size={16} className={wished ? "fill-primary text-primary" : ""} />
        </button>
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
          {/* PRODUCT IMAGE: replace with your own photo of {product.name} */}
          <img
            src={product.image}
            alt={`${product.name} research peptide vial`}
            loading="lazy"
            className="aspect-square w-full bg-surface object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
      </div>
      <div className={compact ? "p-3" : "p-4"}>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="text-sm font-semibold text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">{product.series}</p>
        <p className="mt-2 text-sm font-bold text-foreground">
          {product.oldPrice && (
            <span className="mr-2 text-xs font-normal text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          {priceLabel(product)}
        </p>
      </div>
    </div>
  );
}
