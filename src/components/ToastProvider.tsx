import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import styled, { keyframes } from "styled-components";

type ToastType = "success" | "error" | "info";
type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};

type ToastContextValue = {
  show: (message: string, type?: ToastType, durationMs?: number) => void;
  success: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
  info: (message: string, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

const slideIn = keyframes`
  from { transform: translateY(-6px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
`;
const fadeOut = keyframes`
  to { opacity: 0; transform: translateY(-6px); }
`;

const Wrap = styled.div`
  position: fixed;
  top: 12px;
  right: 12px;
  display: grid;
  gap: 8px;
  z-index: 9999;
`;

const Banner = styled.div<{ type: ToastType; leaving?: boolean }>`
  min-width: 280px;
  max-width: 420px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  background: ${({ type }) =>
    type === "success"
      ? "var(--success)"
      : type === "error"
      ? "var(--danger)"
      : "var(--brand)"};
  animation: ${slideIn} 0.14s ease-out,
    ${({ leaving }) => (leaving ? fadeOut : "none")} 0.18s ease-out forwards;
`;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const leaving = useRef(new Set<string>());

  const remove = (id: string) => {
    leaving.current.add(id);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
      leaving.current.delete(id);
    }, 180);
  };

  const show = (
    message: string,
    type: ToastType = "info",
    durationMs = 3000
  ) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, type, message, duration: durationMs }]);
    if (durationMs > 0) setTimeout(() => remove(id), durationMs);
  };

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (m, d) => show(m, "success", d),
      error: (m, d) => show(m, "error", d),
      info: (m, d) => show(m, "info", d),
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Wrap>
        {toasts.map((t) => (
          <Banner key={t.id} type={t.type} leaving={leaving.current.has(t.id)}>
            {t.message}
          </Banner>
        ))}
      </Wrap>
    </ToastContext.Provider>
  );
};
