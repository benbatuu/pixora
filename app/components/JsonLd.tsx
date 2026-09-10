import { buildSiteJsonLd } from "@/lib/seo/json-ld";
import type { SiteSettings } from "@/lib/admin/types";

export default function JsonLd({ settings }: { settings: SiteSettings }) {
  const nodes = buildSiteJsonLd(settings);
  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
