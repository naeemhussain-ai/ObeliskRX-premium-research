import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type CoaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  fileTypes?: string[];
  title: string;
};

const FILE_CLASS = "w-full rounded-lg border border-border shadow-card";

function dataUriToBytes(uri: string): Uint8Array {
  const base64 = uri.slice(uri.indexOf(",") + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// COA files live under the same domain as the site in production, so pdf.js can
// fetch them directly. In dev the app runs on a different port, so route the
// request through Vite's /backend proxy to keep it same-origin (avoids CORS).
function resolvePdfSrc(src: string): string {
  if (src.startsWith("data:")) return src;
  try {
    const url = new URL(src, window.location.origin);
    if (url.origin === window.location.origin) return url.pathname + url.search;
    if (import.meta.env.DEV && url.pathname.includes("/backend/")) {
      return url.pathname.replace(/^.*?(\/backend\/)/, "$1") + url.search;
    }
    return src;
  } catch {
    return src;
  }
}

// Renders every page of a PDF as its own canvas so the certificate shows inline
// like an image, with no embedded browser PDF viewer (and no dark viewer chrome).
function CoaPdf({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    setStatus("loading");

    const resolved = resolvePdfSrc(src);
    const task = pdfjsLib.getDocument(
      resolved.startsWith("data:")
        ? { data: dataUriToBytes(resolved) }
        : { url: resolved },
    );

    (async () => {
      try {
        const pdf = await task.promise;
        if (cancelled) return;

        container.replaceChildren();
        const cssWidth = container.clientWidth || 640;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          if (cancelled) return;

          const unscaled = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({
            scale: (cssWidth / unscaled.width) * dpr,
          });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = FILE_CLASS;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.setAttribute("role", "img");
          canvas.setAttribute("aria-label", `${alt} — page ${pageNum}`);
          container.appendChild(canvas);

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        }

        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      task.destroy();
    };
  }, [src, alt]);

  if (status === "error") {
    return (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className={`${FILE_CLASS} flex items-center justify-center bg-white p-6 text-sm font-medium text-primary underline`}
      >
        Open certificate (PDF)
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={containerRef} className="flex flex-col gap-4" />
      {status === "loading" && (
        <p className="text-center text-sm text-muted-foreground">
          Loading certificate…
        </p>
      )}
    </div>
  );
}

function CoaFile({ src, type, alt }: { src: string; type?: string; alt: string }) {
  const isPdf = type
    ? type.includes("pdf")
    : src.startsWith("data:application/pdf");

  if (isPdf) return <CoaPdf src={src} alt={alt} />;

  return <img src={src} alt={alt} className={FILE_CLASS} />;
}

export function CoaDialog({ open, onOpenChange, images, fileTypes, title }: CoaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] w-[95vw] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-border p-4 text-left sm:p-5">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Certificate of Analysis</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto bg-surface p-4 sm:p-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {images.map((src, i) => (
              <CoaFile
                key={i}
                src={src}
                type={fileTypes?.[i]}
                alt={`${title} Certificate of Analysis   page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
