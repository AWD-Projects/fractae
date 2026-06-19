"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "loading";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (message: string) => string;
  error: (message: string) => string;
  loading: (message: string) => string;
  update: (id: string, message: string, type: "success" | "error") => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <Toaster>");
  return ctx;
}

let counter = 0;
function genId() {
  return `t-${++counter}-${Math.random().toString(36).slice(2, 6)}`;
}

const ICON: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} color="#16a34a" strokeWidth={2} />,
  error: <XCircle size={18} color="#dc2626" strokeWidth={2} />,
  loading: (
    <Loader2
      size={18}
      color="#00399d"
      strokeWidth={2}
      className="animate-spin"
    />
  ),
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e8e8e8",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        maxWidth: 360,
        width: "100%",
        animation: "toast-in 200ms ease forwards",
      }}
    >
      <span style={{ flexShrink: 0, lineHeight: 0 }}>{ICON[toast.type]}</span>
      <span
        style={{
          flex: 1,
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "#1a1c1c",
          lineHeight: 1.4,
        }}
      >
        {toast.message}
      </span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          lineHeight: 0,
          flexShrink: 0,
          color: "#b3b3b3",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (message: string, type: ToastType, ttl?: number): string => {
      const id = genId();
      setToasts((prev) => {
        const next = [...prev, { id, message, type }];
        return next.length > 5 ? next.slice(next.length - 5) : next;
      });
      if (ttl) {
        const timer = setTimeout(() => dismiss(id), ttl);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss]
  );

  const success = useCallback(
    (message: string) => add(message, "success", 3000),
    [add]
  );
  const error = useCallback(
    (message: string) => add(message, "error", 5000),
    [add]
  );
  const loading = useCallback(
    (message: string) => add(message, "loading"),
    [add]
  );

  const update = useCallback(
    (id: string, message: string, type: "success" | "error") => {
      clearTimeout(timers.current.get(id));
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, message, type } : t))
      );
      const ttl = type === "success" ? 3000 : 5000;
      const timer = setTimeout(() => dismiss(id), ttl);
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ success, error, loading, update, dismiss }}>
      {children}
      <style>{`
        @keyframes toast-in {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "flex-end",
          pointerEvents: toasts.length ? "auto" : "none",
        }}
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
