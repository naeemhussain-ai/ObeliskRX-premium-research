import { Link } from "@/lib/router";

export function NotFoundPage() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-7xl font-extrabold tracking-tight text-primary sm:text-8xl">404</p>
      <h1 className="mt-4 text-3xl font-bold text-foreground">Page not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The link you opened does not match a page on this site.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to home
      </Link>
    </div>
  );
}
