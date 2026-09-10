type Props = {
  label: string;
  value: string | number;
  hint?: string;
};

export default function AdminStatCard({ label, value, hint }: Props) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-px-body">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-px-black">{value}</p>
      {hint ? <p className="mt-1 text-xs text-px-body">{hint}</p> : null}
    </div>
  );
}
