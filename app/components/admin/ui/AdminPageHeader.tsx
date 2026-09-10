import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
};

export default function AdminPageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-px-body">
            {breadcrumb.map((b, i) => (
              <span key={`${b.label}-${i}`} className="inline-flex items-center gap-1.5">
                {i > 0 ? <span aria-hidden>/</span> : null}
                {b.href ? (
                  <Link href={b.href} className="hover:text-px-black">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-px-black">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-px-black md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-px-body">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
