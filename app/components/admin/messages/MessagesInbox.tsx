"use client";

import { useCallback, useEffect, useState } from "react";
import AdminEmptyState from "@/app/components/admin/ui/AdminEmptyState";
import { useToast } from "@/app/components/admin/ui/ToastProvider";
import { useConfirm } from "@/app/components/admin/ui/ConfirmDialog";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  locale: string | null;
  readAt: string | null;
  archivedAt: string | null;
  createdAt: string;
};

type Filter = "inbox" | "archived";

export default function MessagesInbox() {
  const { success, error: toastError } = useToast();
  const { confirmDelete } = useConfirm();
  const [filter, setFilter] = useState<Filter>("inbox");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/messages?filter=${filter}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yüklenemedi");
      setMessages(data.messages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Güncellenemedi");
      await load();
      // notify sidebar badge
      window.dispatchEvent(new Event("admin:messages-changed"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const ok = await confirmDelete("Bu mesajı silmek istediğine emin misin?");
    if (!ok) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silinemedi");
      if (openId === id) setOpenId(null);
      success("Mesaj silindi");
      await load();
      window.dispatchEvent(new Event("admin:messages-changed"));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hata";
      setError(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function openMessage(m: ContactMessage) {
    setOpenId((prev) => (prev === m.id ? null : m.id));
    if (!m.readAt) {
      await patch(m.id, { read: true });
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {error}
        </p>
      ) : null}

      <div className="flex gap-2">
        {(
          [
            { key: "inbox", label: "Gelen" },
            { key: "archived", label: "Arşiv" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              setFilter(t.key);
              setOpenId(null);
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === t.key
                ? "bg-px-black text-white"
                : "bg-[#f0f0f0] text-px-body hover:text-px-black"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-px-body">Yükleniyor…</p>
      ) : messages.length === 0 ? (
        <AdminEmptyState
          title={filter === "inbox" ? "Gelen kutusu boş" : "Arşiv boş"}
          description="Public iletişim formundan gelen mesajlar burada listelenir."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => {
            const unread = !m.readAt;
            const isOpen = openId === m.id;
            return (
              <article
                key={m.id}
                className={`rounded-2xl border bg-white p-5 transition ${
                  unread ? "border-px-red/25" : "border-black/8"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full flex-wrap items-start justify-between gap-2 text-left"
                  onClick={() => void openMessage(m)}
                >
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-px-black">
                      {unread ? (
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-px-red align-middle" />
                      ) : null}
                      {m.subject}
                    </h2>
                    <p className="mt-1 text-xs text-px-body">
                      {m.name} · {m.email} ·{" "}
                      {new Date(m.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                      unread
                        ? "bg-[#e11010]/10 text-px-red"
                        : "bg-[#f0f0f0] text-px-body"
                    }`}
                  >
                    {unread ? "Yeni" : "Okundu"}
                  </span>
                </button>

                {isOpen ? (
                  <div className="mt-4 border-t border-black/6 pt-4">
                    <p className="whitespace-pre-wrap text-sm text-px-body">
                      {m.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {unread ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void patch(m.id, { read: true })}
                          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-[#f7f7f7] disabled:opacity-60"
                        >
                          Okundu işaretle
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void patch(m.id, { read: false })}
                          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-[#f7f7f7] disabled:opacity-60"
                        >
                          Okunmadı yap
                        </button>
                      )}
                      {m.archivedAt ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void patch(m.id, { archived: false })}
                          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-[#f7f7f7] disabled:opacity-60"
                        >
                          Arşivden çıkar
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void patch(m.id, { archived: true })}
                          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-[#f7f7f7] disabled:opacity-60"
                        >
                          Arşivle
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void remove(m.id)}
                        className="rounded-full border border-px-red/40 px-3 py-1.5 text-xs font-semibold text-px-red hover:bg-[#e11010]/5 disabled:opacity-60"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
