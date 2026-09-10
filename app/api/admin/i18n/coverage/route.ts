import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";

function pct(have: number, total: number) {
  if (total <= 0) return 100;
  return Math.round((have / total) * 100);
}

export const GET = withAdmin(async () => {
  const locales = await prisma.locale.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
  });
  const defaultLocale = locales.find((l) => l.isDefault) ?? locales[0];
  if (!defaultLocale) {
    throw new ApiError("Aktif dil yok", 400);
  }

  const [
    projectTotal,
    postTotal,
    sectionTotal,
    navTotal,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.pageSection.count(),
    prisma.navItem.count(),
  ]);

  // Default-locale translation counts as baseline "expected"
  const [
    defProjects,
    defPosts,
    defSections,
    defNav,
  ] = await Promise.all([
    prisma.projectTranslation.count({ where: { localeId: defaultLocale.id } }),
    prisma.postTranslation.count({ where: { localeId: defaultLocale.id } }),
    prisma.pageSectionTranslation.count({
      where: { localeId: defaultLocale.id },
    }),
    prisma.navItemTranslation.count({ where: { localeId: defaultLocale.id } }),
  ]);

  const baseProjects = Math.max(projectTotal, defProjects);
  const basePosts = Math.max(postTotal, defPosts);
  const baseSections = Math.max(sectionTotal, defSections);
  const baseNav = Math.max(navTotal, defNav);
  const baseAll = baseProjects + basePosts + baseSections + baseNav;

  const coverage = [];
  for (const loc of locales) {
    const [projects, posts, sections, navItems] = await Promise.all([
      prisma.projectTranslation.count({ where: { localeId: loc.id } }),
      prisma.postTranslation.count({ where: { localeId: loc.id } }),
      prisma.pageSectionTranslation.count({ where: { localeId: loc.id } }),
      prisma.navItemTranslation.count({ where: { localeId: loc.id } }),
    ]);
    const translated = projects + posts + sections + navItems;
    coverage.push({
      localeId: loc.id,
      code: loc.code,
      name: loc.name,
      isDefault: loc.isDefault,
      projects: { have: projects, total: baseProjects, percent: pct(projects, baseProjects) },
      posts: { have: posts, total: basePosts, percent: pct(posts, basePosts) },
      sections: { have: sections, total: baseSections, percent: pct(sections, baseSections) },
      navItems: { have: navItems, total: baseNav, percent: pct(navItems, baseNav) },
      overall: {
        have: translated,
        total: baseAll,
        percent: pct(translated, baseAll),
      },
    });
  }

  return ok({
    defaultLocale: { id: defaultLocale.id, code: defaultLocale.code },
    coverage,
  });
});
