import { buildSiteJsonLd, jsonLdScriptContents } from "@/lib/seo/json-ld";
import type { SiteSettings } from "@/lib/admin/types";

export function JsonLdNodes({ nodes }: { nodes: Record<string, unknown>[] }) {
  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScriptContents(node) }}
        />
      ))}
    </>
  );
}

export default function JsonLd({ settings }: { settings: SiteSettings }) {
  return <JsonLdNodes nodes={buildSiteJsonLd(settings)} />;
}
