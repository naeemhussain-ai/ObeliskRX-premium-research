import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type PropsWithChildren,
} from "react";

const appBase = import.meta.env.BASE_URL.replace(/\/$/, "");

type RouteState = {
  path: string;
  params: Record<string, string>;
};

const RouteStateContext = createContext<RouteState>({ path: "/", params: {} });

export function getCurrentPath() {
  if (typeof window === "undefined") return "/";
  const pathname = window.location.pathname || "/";
  if (!appBase || appBase === "/") return pathname;

  if (pathname === appBase) return "/";
  if (pathname.startsWith(`${appBase}/`)) {
    const trimmed = pathname.slice(appBase.length);
    return trimmed || "/";
  }

  return pathname;
}

export function navigateTo(path: string, replace = false) {
  if (typeof window === "undefined") return;
  const method = replace ? "replaceState" : "pushState";
  const targetPath = path === "/" ? `${appBase || ""}/` : `${appBase}${path}`;
  window.history[method](null, "", targetPath);
  window.scrollTo({ top: 0, behavior: "instant" });
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function buildPath(to: string, params?: Record<string, string>) {
  if (!params) return to;
  return to.replace(/\$([A-Za-z0-9_]+)/g, (_, key: string) => {
    const value = params[key];
    return value ? encodeURIComponent(value) : "";
  });
}

export function matchPath(pattern: string, path: string) {
  if (pattern === path) return {};

  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i += 1) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (!patternPart || !pathPart) return null;

    if (patternPart.startsWith("$")) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (patternPart !== pathPart) return null;
  }

  return params;
}

export function RouteStateProvider({
  path,
  params,
  children,
}: PropsWithChildren<RouteState>) {
  const value = useMemo(() => ({ path, params }), [params, path]);
  return <RouteStateContext.Provider value={value}>{children}</RouteStateContext.Provider>;
}

export function useCurrentPath() {
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    const handleLocationChange = () => setPath(getCurrentPath());
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  return path;
}

export function useRouteParams<T extends Record<string, string>>() {
  return useContext(RouteStateContext).params as T;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  params?: Record<string, string>;
  activeOptions?: { exact?: boolean };
  activeProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  inactiveProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
};

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function Link({
  to,
  params,
  activeOptions,
  activeProps,
  inactiveProps,
  className,
  onClick,
  target,
  children,
  ...rest
}: LinkProps) {
  const currentPath = useCurrentPath();
  const href = buildPath(to, params);
  const isActive = activeOptions?.exact ? currentPath === href : currentPath.startsWith(href);
  const variantProps = isActive ? activeProps : inactiveProps;

  return (
    <a
      {...rest}
      {...variantProps}
      href={href}
      target={target}
      className={mergeClassNames(className, variantProps?.className)}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          isModifiedEvent(event) ||
          target === "_blank" ||
          !href.startsWith("/")
        ) {
          return;
        }

        event.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}
