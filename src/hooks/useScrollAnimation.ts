import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Hook that triggers a CSS class when an element scrolls into view.
 * Uses IntersectionObserver for performance.
 *
 * @param options.threshold - Visibility threshold (0-1), default 0.15
 * @param options.rootMargin - Margin around root, default "0px 0px -60px 0px"
 * @param options.triggerOnce - Only trigger once, default true
 * @returns [ref, isVisible]
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options?: {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
  },
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
    triggerOnce = true,
  } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(el);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

/**
 * Hook for staggered scroll animation on a parent container.
 * Applies `animate-visible` to the parent and stagger delays to children via CSS.
 */
export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
  options?: {
    threshold?: number;
    rootMargin?: string;
  },
): [RefObject<T | null>, boolean] {
  return useScrollAnimation<T>({
    threshold: options?.threshold ?? 0.1,
    rootMargin: options?.rootMargin ?? "0px 0px -40px 0px",
    triggerOnce: true,
  });
}
