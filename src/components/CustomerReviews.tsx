import { useEffect, useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/useToast";

const API = import.meta.env.VITE_API_URL ?? "http://localhost/obeliskrx/api";

type Review = {
  name: string;
  rating: number;
  review_text: string;
  created_at: string;
};

type CustomerReviewsProps = {
  slug: string;
  title?: string;
};

export function CustomerReviews({ slug, title = "Customer Reviews" }: CustomerReviewsProps) {
  const { addToast } = useToast();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    setReviewsLoading(true);
    fetch(`${API}/reviews/get.php?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setReviews(data.data.reviews || []);
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [slug]);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!rating) {
      addToast({ message: "Please select a rating", type: "error" });
      return;
    }
    if (reviewText.trim().length < 10) {
      addToast({ message: "Review must be at least 10 characters", type: "error" });
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API}/reviews/submit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_slug: slug,
          name: reviewName,
          email: reviewEmail,
          rating,
          review_text: reviewText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({ message: "Review submitted! It will appear after admin approval.", type: "success" });
        setReviewText("");
        setReviewName("");
        setReviewEmail("");
        setRating(0);
      } else {
        addToast({ message: data.message || "Failed to submit review", type: "error" });
      }
    } catch {
      addToast({ message: "Could not connect to server", type: "error" });
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Left - existing reviews */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {reviewsLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={22} className="text-muted-foreground/30" />
                ))}
              </div>
              <p className="text-sm font-medium text-foreground">No reviews yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Be the first to share your experience
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((r, i) => (
                <div key={i} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={14}
                          className={
                            n <= r.rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/30"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {r.review_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right - write a review */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="text-base font-bold text-foreground">Write a Review</h3>
          <p className="mt-1 text-xs text-muted-foreground">Required fields are marked *</p>

          <form className="mt-5 space-y-4" onSubmit={handleReviewSubmit}>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                Your rating *
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} stars`}
                  >
                    <Star
                      size={20}
                      className={
                        n <= rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/40 hover:text-muted-foreground"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                Your review *
              </label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">Name *</label>
                <input
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">Email *</label>
                <input
                  type="email"
                  value={reviewEmail}
                  onChange={(e) => setReviewEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {reviewSubmitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
