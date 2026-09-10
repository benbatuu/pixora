/**
 * Contact message stubs
 *
 * Seed + content-layer fallback only (seed + content fallback).
 * Admin dashboard / live lists must use Prisma / API — do not import
 * these arrays for primary admin counts or inbox.
 */

import type { ContactMessage } from "@/lib/admin/types";

/** Contact inbox stub. */
export const CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: "m1",
    name: "Alex Rivera",
    email: "alex@example.com",
    subject: "Brand identity inquiry",
    body: "We are looking for a full brand refresh for Q2.",
    createdAt: "2026-09-08T10:22:00.000Z",
    read: false,
  },
  {
    id: "m2",
    name: "Sam Chen",
    email: "sam@studio.co",
    subject: "Web redesign",
    body: "Interested in a multipage marketing site rebuild.",
    createdAt: "2026-09-05T16:04:00.000Z",
    read: true,
  },
];
