import { createPortal } from "react-dom";
import { CheckCircle, Info, X, XCircle } from "lucide-react";
import { useToast, type Toast as ToastType } from "@/hooks/useToast";

const iconMap = {
  success: CheckCircle,
  info: Info,
  error: XCircle,
};

const colorMap = {
  success: "text-emerald-500",
  info: "text-blue-500",
  error: "text-red-500",
};

function ToastItem({ toast, onClose }: { toast: ToastType; onClose: () => void }) {
  const Icon = iconMap[toast.type];

  return (
    <div
      className="anim-fade-in-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3.5 shadow-xl"
      style={{ animationDuration: "0.35s" }}
    >
      {toast.image ? (
        <img
          src={toast.image}
          alt=""
          className="size-10 shrink-0 rounded-lg bg-gray-100 object-cover"
        />
      ) : (
        <Icon size={20} className={`mt-0.5 shrink-0 ${colorMap[toast.type]}`} />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{toast.message}</p>
        {toast.subtitle && (
          <p className="mt-0.5 text-xs text-gray-500">{toast.subtitle}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <X size={14} />
      </button>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden rounded-b-xl">
        <div className="toast-progress h-full bg-primary/30" />
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (typeof document === "undefined" || toasts.length === 0) return null;

  return createPortal(
    <div className="pointer-events-none fixed bottom-6 right-6 z-[99990] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body,
  );
}
