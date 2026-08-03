import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Heart, Link2, Linkedin, Minus, Plus, Star, Twitter, Check } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/useToast";
import { useStaggerAnimation, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { formatPrice, getProduct, priceLabel, products, type Product } from "@/lib/products";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product not found   ObeliskRX" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name}   ${product.series} | ObeliskRX`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description.slice(0, 155) },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.slug}` }],
    };
  },
  notFoundComponent: ProductNotFound,
  errorComponent: ProductNotFound,
  component: ProductDetail,
});

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
  const { product } = Route.useLoaderData() as { product: Product };
  const { add } = useCart();
  const { addToast } = useToast();
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const [heroRef, heroVisible] = useStaggerAnimation<HTMLDivElement>();
  const [reviewsRef, reviewsVisible] = useScrollAnimation<HTMLElement>();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 5);

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
      qty,
    );
    addToast({
      message: "Added to cart",
      subtitle: `${qty}x ${product.name} - ${selectedSize}`,
      type: "success",
      image: product.image,
    });
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
        className={`mt-6 grid gap-12 lg:grid-cols-2 animate-on-scroll ${heroVisible ? "animate-visible" : ""}`}
      >
        <div className="rounded-lg bg-card p-6 shadow-card anim-fade-in-up">
          {/* PRODUCT DETAIL MAIN IMAGE */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={`${product.name} vial`}
              className="aspect-square w-full bg-surface object-cover transition-transform duration-500 hover:scale-105 hover-glow"
            />
          </div>
        </div>

        <div className="rounded-lg bg-card p-6 shadow-card sm:p-8 anim-fade-in-up" style={{ animationDelay: "100ms" }}>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through font-normal">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-3xl font-bold text-primary">
              {priceLabel(product)}
            </span>
            {product.discount > 0 && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                Save {product.discount}%
              </span>
            )}
          </div>
          <div className="my-6 h-px w-full bg-border" />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {product.specs.map((s) => (
              <li key={s.label}>
                {s.label}: {s.value}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3 text-sm">
            <span className="font-medium">Size :</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="rounded-full border border-border px-4 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Choose an option</option>
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
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
            <button
              type="button"
              onClick={handleAdd}
              disabled={isAdding}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${
                isAdding ? "bg-emerald-500 scale-105" : "bg-primary hover:bg-primary/90 hover:-translate-y-0.5"
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
            <button
              type="button"
              aria-label="Add to wishlist"
              className="rounded-full border border-border p-3 text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:scale-110 active:scale-95"
            >
              <Heart size={16} />
            </button>
          </div>

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

      {/* Related Products — above reviews */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} compact />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section
        ref={reviewsRef}
        className={`mt-16 animate-on-scroll animate-scale ${reviewsVisible ? "animate-visible" : ""}`}
      >
        <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

          {/* Left — existing reviews */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map((n) => (
                  <Star key={n} size={22} className="text-muted-foreground/30" />
                ))}
              </div>
              <p className="text-sm font-medium text-foreground">No reviews yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Be the first to share your experience</p>
            </div>
          </div>

          {/* Right — write a review */}
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-base font-bold text-foreground">Write a Review</h3>
            <p className="mt-1 text-xs text-muted-foreground">Required fields are marked *</p>

            <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">Your rating *</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                      <Star
                        size={20}
                        className={n <= rating ? "fill-primary text-primary" : "text-muted-foreground/40 hover:text-muted-foreground"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">Your review *</label>
                <textarea
                  rows={4}
                  placeholder="Share your experience..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Name *</label>
                  <input
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-foreground">Email *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Submit Review
              </button>
            </form>
          </div>
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
