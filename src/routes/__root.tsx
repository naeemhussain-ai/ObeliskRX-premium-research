import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer, Notice } from "@/components/Footer";
import { ToastProvider } from "@/hooks/useToast";
import { ToastContainer } from "@/components/Toast";
import { BackToTop } from "@/components/BackToTop";
import favicon from "@/assets/products/Obelisk---Logo-Design---Favicon.png";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ObeliskRX — Research-Grade Peptides" },
      {
        name: "description",
        content:
          "Research-grade peptides, independently tested and verified to 99%+ purity. For laboratory research use only.",
      },
      { property: "og:site_name", content: "ObeliskRX" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: favicon, type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AgeVerificationModal() {
  const [open, setOpen] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("obelisk_verified_21");
    if (!verified) {
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("obelisk_verified_21", "true");
    document.body.style.overflow = "auto";
    setOpen(false);
  };

  const handleDecline = () => {
    setDeclined(true);
    // Redirect to google after 2 seconds
    setTimeout(() => {
      window.location.href = "https://www.google.com";
    }, 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/98 backdrop-blur-xl" />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-500 sm:p-12 border border-border">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">ObeliskRX</h2>
        <h3 className="mt-2 text-xl font-medium text-gray-800">Researcher Verification</h3>
        
        {declined ? (
          <div className="mt-8 animate-in fade-in zoom-in duration-300">
            <p className="text-lg font-semibold text-primary">
              Access Denied. You must be 21 or older to enter.
            </p>
            <p className="mt-2 text-sm text-gray-500">Redirecting...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <p className="mt-6 text-sm leading-relaxed text-gray-600">
              ObeliskRX provides research peptides exclusively to qualified researchers and laboratories for in vitro and laboratory use. Please confirm before continuing. I confirm I am at least 21 years of age, a qualified researcher purchasing for in vitro / laboratory research only, and I understand ObeliskRX DOES NOT provide dosing information or usage instructions for any product distributed on this site.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              By proceeding you affirm the statement above is true. Products are not for human or veterinary use, not for use in diagnostic procedures, and have not been evaluated by the U.S. Food and Drug Administration. <a href="#" className="font-semibold underline hover:text-primary transition-colors">Full disclaimer.</a>
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleAccept}
                className="w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
              >
                I Am 21 Or Older
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
              >
                I Am Under 21
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <ToastProvider>
          <div className="flex min-h-screen flex-col bg-surface">
            <Header />
            <main className="flex-1">
              {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
              <Outlet />
            </main>
            <Notice />
            <Footer />
          </div>
          <ToastContainer />
          <BackToTop />
          <AgeVerificationModal />
        </ToastProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

