/** Lightweight placeholder body until feature UI is built. */
export default function AdminPlaceholder({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-6 text-sm text-px-body shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {children ?? (
        <p>
          Bu bölümün arayüzü sonraki adımda detaylandırılacak. Klasör / route
          iskeleti hazır.
        </p>
      )}
    </div>
  );
}
