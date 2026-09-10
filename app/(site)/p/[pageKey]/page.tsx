import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  listOrderedPageSections,
  publicPathForPageKey,
} from "@/lib/content/pages";
import { getRequestLocale } from "@/lib/i18n/get-locale";
import { getSiteSettings } from "@/lib/content/settings";
import { buildPageMetadata } from "@/lib/seo/metadata";
import SectionRenderer from "@/app/components/pages/sections/SectionRenderer";
import { prisma } from "@/lib/db/prisma";
import { PUBLIC_ROUTE_PAGE_KEYS } from "@/lib/admin/constants";

export const revalidate = 60;

type Props = { params: Promise<{ pageKey: string }> };

const RESERVED = new Set([
  ...PUBLIC_ROUTE_PAGE_KEYS,
  "blog",
  "projects",
  "admin",
  "api",
  "p",
]);

async function pageExists(key: string): Promise<boolean> {
  try {
    const row = await prisma.page.findUnique({
      where: { key },
      select: { id: true, status: true },
    });
    return Boolean(row && row.status === "PUBLISHED");
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageKey } = await params;
  const locale = await getRequestLocale();
  const settings = await getSiteSettings();
  const path = publicPathForPageKey(pageKey);
  return buildPageMetadata(settings, "home", {
    path,
    title: pageKey,
    description: `Pixora — ${pageKey}`,
    locale,
  });
}

export default async function DynamicCmsPage({ params }: Props) {
  const { pageKey } = await params;
  const key = pageKey.trim().toLowerCase();

  if (!key || RESERVED.has(key) || key.includes("/")) {
    notFound();
  }

  const exists = await pageExists(key);
  if (!exists) notFound();

  const locale = await getRequestLocale();
  const sections = await listOrderedPageSections(key, locale);

  return <SectionRenderer sections={sections} />;
}
