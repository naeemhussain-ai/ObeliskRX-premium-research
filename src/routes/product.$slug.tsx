import { useState, useEffect } from "react";
import {
  BadgeCheck,
  Check,
  ExternalLink,
  Facebook,
  FlaskConical,
  Heart,
  Link2,
  Linkedin,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
  Twitter,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CoaDialog } from "@/components/CoaDialog";
import { useCart } from "@/lib/cart";
import { Link, useRouteParams } from "@/lib/router";
import { useToast } from "@/hooks/useToast";
import { useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { getCoa } from "@/lib/coa";
import { formatPrice, useProducts, priceForSize, priceLabel } from "@/lib/products";

function ProductNotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Link to="/catalog" className="mt-4 inline-block text-sm text-primary underline">
        Back to catalog
      </Link>
    </div>
  );
}

const shareIcons = [Facebook, Twitter, Star, Linkedin, Link2];

function ProductDetail() {
  const products = useProducts();
  const { slug } = useRouteParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);

  const { add } = useCart();
  const { addToast } = useToast();
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [coaOpen, setCoaOpen] = useState(false);
  const [heroRef, heroVisible] = useStaggerAnimation<HTMLDivElement>();

  useEffect(() => {
    if (product?.sizes[0] && !size) setSize(product.sizes[0]);
  }, [product?.slug]);

  if (!product) {
    return <ProductNotFound />;
  }

  const sizedPrice = priceForSize(product, size);
  const coa = getCoa(product.slug);

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 5);

  const handleAdd = () => {
    setIsAdding(true);
    const selectedSize = size || product.sizes[0];
    add(
      {
        slug: product.slug,
        name: product.name,
        size: selectedSize,
        price: priceForSize(product, selectedSize) ?? product.price,
        image: product.image,
      },
      qty,
    );
    addToast({
      message: "Added to cart",
      subtitle: `${qty}x ${product.name} - ${selectedSize}`,
      type: "success",
      image: product.image,
    });
    setAddedToCart(true);
    setTimeout(() => setIsAdding(false), 400);
  };

  return (
    <div className="container-page py-8">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/catalog" className="hover:text-primary">
          Shop
        </Link>{" "}
        / {product.series} / <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      <div
        ref={heroRef}
        className={`mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14 animate-on-scroll ${heroVisible ? "animate-visible" : ""}`}
      >
        {/* ===== Image ===== */}
        <div className="anim-fade-in-up">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-card sm:p-12">
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-foreground shadow-sm">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Independently Tested · 99%+ Purity
            </span>
            <img
              src={product.image}
              alt={`${product.name} vial`}
              className="aspect-square w-full object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* ===== Details ===== */}
        <div className="anim-fade-in-up" style={{ animationDelay: "100ms" }}>
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            {product.series}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>

          {product.specs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.specs.slice(0, 3).map((s) => (
                <span
                  key={s.label}
                  className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  {s.value}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              In Stock
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
              <BadgeCheck size={13} /> Third-Party Tested
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
              <FlaskConical size={13} /> HPLC + LC-MS Verified
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-xs leading-relaxed text-foreground/80">
            <span className="font-bold text-destructive">For research use only -</span> this
            product is a laboratory research chemical. It is not for human or veterinary use, not a
            drug, supplement, or food, and is not intended to diagnose, treat, cure, or prevent any
            disease. Sold only to qualified researchers and institutions.
          </div>

          <div className="my-6 h-px w-full bg-border" />

          <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {product.specs.map((s) => (
              <li key={s.label}>
                <span className="font-medium text-foreground">{s.label}:</span> {s.value}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Size
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    size === s
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through font-normal">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-3xl font-bold text-primary">
              {sizedPrice !== null ? formatPrice(sizedPrice) : priceLabel(product)}
            </span>
            {product.discount > 0 && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                Save {product.discount}%
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2.5 text-muted-foreground hover:text-primary"
              >
                <Minus size={14} />
              </button>
              <span className="min-w-8 text-center text-sm">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2.5 text-muted-foreground hover:text-primary"
              >
                <Plus size={14} />
              </button>
            </div>
            {coa ? (
              <button
                type="button"
                onClick={() => setCoaOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-surface py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ShieldCheck size={15} /> View COA
              </button>
            ) : (
              <Link
                to="/coa"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-surface py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ShieldCheck size={15} /> View COA
              </Link>
            )}
            <button
              type="button"
              aria-label="Add to wishlist"
              className="rounded-full border border-border p-3 text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:scale-110 active:scale-95"
            >
              <Heart size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${
              isAdding
                ? "bg-emerald-500 scale-105"
                : "bg-primary hover:bg-primary/90 hover:-translate-y-0.5"
            }`}
          >
            {isAdding ? (
              <>
                <Check size={18} className="anim-bounce-in" /> Added To Cart
              </>
            ) : (
              "Add To Cart"
            )}
          </button>

          {addedToCart && (
            <Link
              to="/cart"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Proceed to Checkout ←’
            </Link>
          )}

          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Lock size={12} /> Secure Encrypted Checkout
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-border bg-surface p-4 text-center">
            <div>
              <Truck size={18} className="mx-auto text-[#6FA9D8]" />
              <p className="mt-1.5 text-[11px] font-bold text-foreground">Same-Day Shipping</p>
              <p className="text-[10px] text-muted-foreground">Order before 2pm</p>
            </div>
            <div>
              <BadgeCheck size={18} className="mx-auto text-[#6FA9D8]" />
              <p className="mt-1.5 text-[11px] font-bold text-foreground">COA Verified</p>
              <p className="text-[10px] text-muted-foreground">Every batch tested</p>
            </div>
            <div>
              <Lock size={18} className="mx-auto text-[#6FA9D8]" />
              <p className="mt-1.5 text-[11px] font-bold text-foreground">Secure Checkout</p>
              <p className="text-[10px] text-muted-foreground">Encrypted payment</p>
            </div>
          </div>

          {coa && (
            <div className="mt-5 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <BadgeCheck size={14} /> Verified COA
                </span>
                <span className="text-[10px] text-muted-foreground">Batch-tested &amp; posted</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Purity (HPLC-UV)</p>
                  <p className="mt-0.5 font-bold text-emerald-600">{coa.purity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Identity (LC-MS)</p>
                  <p className="mt-0.5 font-bold text-foreground">Confirmed</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lot</p>
                  <p className="mt-0.5 font-bold text-foreground">{coa.lot}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reported</p>
                  <p className="mt-0.5 font-bold text-foreground">{coa.tested}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCoaOpen(true)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                View full COA report <ExternalLink size={12} />
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3 text-sm">
            <span className="font-medium">Share:</span>
            {shareIcons.map((Icon, i) => (
              <span
                key={i}
                className="grid size-7 cursor-pointer place-items-center rounded-full border border-border text-muted-foreground hover:text-primary"
              >
                <Icon size={13} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {coa && (
        <CoaDialog
          open={coaOpen}
          onOpenChange={setCoaOpen}
          images={coa.images}
          fileTypes={coa.fileTypes}
          title={product.name}
        />
      )}

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} compact />
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="mt-16 pb-8">
        <h2 className="mb-6 text-2xl font-bold">Recently Viewed</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {products.slice(0, 6).map((p) => (
            <Link
              key={p.slug}
              to="/product/$slug"
              params={{ slug: p.slug }}
              className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <img
                src={p.image}
                alt={p.name}
                className="size-10 shrink-0 rounded bg-surface object-cover"
              />
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold">{p.name}</span>
                <span className="block text-xs text-muted-foreground">{formatPrice(p.price)}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ProductDetailPage() {
  const { slug } = useRouteParams<{ slug: string }>();
  return <ProductDetail key={slug} />;
}

