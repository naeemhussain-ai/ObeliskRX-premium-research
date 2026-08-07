import { useEffect, type ComponentType } from "react";

import { Footer, Notice } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ToastContainer } from "@/components/Toast";
import { ToastProvider } from "@/hooks/useToast";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { RouteStateProvider, matchPath, useCurrentPath } from "@/lib/router";
import { AboutPage } from "@/routes/about";
import { CartPage } from "@/routes/cart";
import { CatalogPage } from "@/routes/catalog";
import { ContactPage } from "@/routes/contact";
import { FaqPage } from "@/routes/faq";
import { HomePage } from "@/routes/index";
import { LoginPage } from "@/routes/login";
import { AccountPage } from "@/routes/account";
import { ProductDetailPage } from "@/routes/product.$slug";
import { RefundPolicyPage } from "@/routes/refund-policy";
import { ResearchArticlesPage } from "@/routes/research-articles";
import { NotFoundPage } from "@/routes/$";

type RouteDefinition = {
  path: string;
  title: string;
  component: ComponentType;
};

const routes: RouteDefinition[] = [
  { path: "/", title: "ObeliskRX | Premium Research Peptides You Can Trust", component: HomePage },
  { path: "/about", title: "ObeliskRX | About Us", component: AboutPage },
  { path: "/catalog", title: "ObeliskRX | Research Peptides Catalog", component: CatalogPage },
  { path: "/contact", title: "ObeliskRX | Contact", component: ContactPage },
  { path: "/faq", title: "ObeliskRX | FAQ", component: FaqPage },
  { path: "/refund-policy", title: "ObeliskRX | Refund Policy", component: RefundPolicyPage },
  { path: "/research-articles", title: "ObeliskRX | Research Articles", component: ResearchArticlesPage },
  { path: "/cart", title: "ObeliskRX | Shopping Cart", component: CartPage },
  { path: "/login", title: "ObeliskRX | Sign In", component: LoginPage },
  { path: "/account", title: "ObeliskRX | My Account", component: AccountPage },
  { path: "/product/$slug", title: "ObeliskRX | Product Detail", component: ProductDetailPage },
];

function RoutedPage() {
  const currentPath = useCurrentPath();

  for (const route of routes) {
    const params = matchPath(route.path, currentPath);
    if (!params) continue;

    const Page = route.component;
    return (
      <RouteStateProvider path={currentPath} params={params}>
        <DocumentTitle title={route.title} />
        <Page />
      </RouteStateProvider>
    );
  }

  return (
    <RouteStateProvider path={currentPath} params={{}}>
      <DocumentTitle title="ObeliskRX | Page Not Found" />
      <NotFoundPage />
    </RouteStateProvider>
  );
}

function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <ToastProvider>
        <div className="flex min-h-screen flex-col bg-surface">
          <Header />
          <main className="flex-1">
            <RoutedPage />
          </main>
          <Notice />
          <Footer />
          <ToastContainer />
        </div>
      </ToastProvider>
    </CartProvider>
    </AuthProvider>
  );
}
