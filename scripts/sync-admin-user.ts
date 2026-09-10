
/**
 * Upserts admin user from ADMIN_EMAIL / ADMIN_PASSWORD env.
 * Does not print secrets.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/admin/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: "ADMIN",
      name: "Batuhan",
    },
    create: {
      email,
      passwordHash,
      role: "ADMIN",
      name: "Batuhan",
    },
  });

  // If seed created admin@pixora.com and env uses another email, keep both;
  // optionally disable placeholder by leaving it with PENDING hash.

  console.log("Admin user synced:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
