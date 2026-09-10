/**
 * Upserts EDITOR user from EDITOR_EMAIL / EDITOR_PASSWORD env.
 * Does not print secrets. Skips if EDITOR_PASSWORD is missing.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/admin/password";

const prisma = new PrismaClient();

async function main() {
  const email = (
    process.env.EDITOR_EMAIL?.trim() || "editor@pixora.com"
  ).toLowerCase();
  const password = process.env.EDITOR_PASSWORD;
  if (!password) {
    console.log(
      "EDITOR_PASSWORD not set — skip editor sync. Set EDITOR_PASSWORD (and optional EDITOR_EMAIL) then re-run pnpm db:sync-editor.",
    );
    return;
  }
  if (password.length < 8) {
    throw new Error("EDITOR_PASSWORD must be at least 8 characters");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "EDITOR",
      name: "Editor",
    },
    create: {
      email,
      passwordHash,
      role: "EDITOR",
      name: "Editor",
    },
  });

  console.log("Editor user synced:", user.email, user.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
