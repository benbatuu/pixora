"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

type ConfirmContextValue = {
  confirmDelete: (message: string, title?: string) => Promise<boolean>;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

type Pending = {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const pendingRef = useRef<Pending | null>(null);

  const close = useCallback((value: boolean) => {
    const current = pendingRef.current;
    pendingRef.current = null;
    setPending(null);
    current?.resolve(value);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      const next = { options, resolve };
      pendingRef.current = next;
      setPending(next);
    });
  }, []);

  const confirmDelete = useCallback(
    (message: string, title = "Silmeyi onayla") =>
      confirm({
        title,
        message,
        confirmLabel: "Sil",
        cancelLabel: "Vazgeç",
      }),
    [confirm],
  );

  const value = useMemo(
    () => ({ confirm, confirmDelete }),
    [confirm, confirmDelete],
  );

  const opts = pending?.options;

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {opts ? (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal
          aria-labelledby="admin-confirm-title"
          onClick={() => close(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-black/8 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="admin-confirm-title"
              className="text-base font-semibold text-px-black"
            >
              {opts.title ?? "Onay"}
            </h2>
            <p className="mt-2 text-sm text-px-body">{opts.message}</p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => close(false)}
                className="inline-flex h-10 items-center rounded-full border border-black/10 px-4 text-sm font-semibold text-px-black hover:bg-[#f7f7f7]"
              >
                {opts.cancelLabel ?? "Vazgeç"}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className="inline-flex h-10 items-center rounded-full bg-px-red px-4 text-sm font-semibold text-white hover:bg-px-black"
              >
                {opts.confirmLabel ?? "Onayla"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return ctx;
}
