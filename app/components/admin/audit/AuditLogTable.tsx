"use client";

import { useCallback, useEffect, useState } from "react";

type AuditRow = {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  meta: unknown;
  createdAt: string;
};

export default function AuditLogTable() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [entityType, setEntityType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = entityType
        ? `?entityType=${encodeURIComponent(entityType)}`
        : "";
      const res = await fetch(`/api/admin/audit${qs}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yüklenemedi");
      setLogs(data.logs ?? []);
      setEntityTypes(data.entityTypes ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setLoading(false);
    }
  }, [entityType]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/8 bg-white p-4">
        <label className="min-w-[200px]">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.06em] text-px-body">
            Varlık türü
          </span>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="h-11 w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 text-sm outline-none focus:border-px-red focus:bg-white"
          >
            <option value="">Tümü</option>
            {entityTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex h-11 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-medium hover:border-px-black"
        >
          Yenile
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-px-red/30 bg-[#e11010]/5 px-4 py-3 text-sm text-px-red">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-px-body">Yükleniyor…</p>
        ) : logs.length === 0 ? (
          <p className="p-6 text-sm text-px-body">Henüz denetim kaydı yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-black/8 bg-[#fafafa] text-xs uppercase tracking-[0.06em] text-px-body">
                <tr>
                  <th className="px-4 py-3 font-medium">Zaman</th>
                  <th className="px-4 py-3 font-medium">İşlem</th>
                  <th className="px-4 py-3 font-medium">Varlık</th>
                  <th className="px-4 py-3 font-medium">Aktör</th>
                  <th className="px-4 py-3 font-medium">Meta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/6">
                {logs.map((row) => (
                  <tr key={row.id} className="hover:bg-[#fafafa]">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-px-body">
                      {new Date(row.createdAt).toLocaleString("tr-TR", {
                        timeZone: "Europe/Istanbul",
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{row.action}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{row.entityType}</span>
                      {row.entityId ? (
                        <span className="mt-0.5 block font-mono text-[10px] text-px-body">
                          {row.entityId}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {row.actorEmail ?? "—"}
                    </td>
                    <td className="max-w-[240px] truncate px-4 py-3 font-mono text-[10px] text-px-body">
                      {row.meta ? JSON.stringify(row.meta) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
