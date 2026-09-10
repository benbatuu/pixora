
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { withAdmin } from "@/lib/api/admin-handler";
import { ok } from "@/lib/api/response";
import { parseJson } from "@/lib/api/validate";
import {
  SITE_SETTING_KEY,
  siteSettingsSchema,
} from "@/lib/admin/settings-schema";
import { getSiteSettings } from "@/lib/content/settings";
import { writeAudit } from "@/lib/admin/audit";

export const GET = withAdmin(async () => {
  const settings = await getSiteSettings();
  return ok({ settings });
}, { role: "ADMIN" });

export const PUT = withAdmin(async (req, { session }) => {
  const body = await parseJson(req, siteSettingsSchema);
  const row = await prisma.setting.upsert({
    where: { key: SITE_SETTING_KEY },
    update: { value: body },
    create: { key: SITE_SETTING_KEY, value: body },
  });
  await writeAudit({
    action: "settings.update",
    entityType: "Setting",
    entityId: row.id,
    meta: { key: SITE_SETTING_KEY },
    session,
  });
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/projects");
  revalidatePath("/blog");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  const settings = await getSiteSettings();
  return ok({ settings });
}, { role: "ADMIN" });
