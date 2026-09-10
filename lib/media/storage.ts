import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type SavedUpload = {
  /** Public URL path or absolute https URL (Blob) */
  url: string;
  /** Absolute filesystem path (local only; empty for Blob) */
  absolutePath: string;
  /** Relative path under public/, or Blob pathname */
  relativePath: string;
  filename: string;
  bytes: number;
  /** Storage backend used */
  provider: "local" | "blob";
};

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

function safeFilename(original: string): string {
  const base = path.basename(original).replace(/[^\w.\-]+/g, "_").slice(0, 120);
  return base || "file";
}

function useBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/**
 * Upload provider: Vercel Blob when BLOB_READ_WRITE_TOKEN is set, else local public/uploads.
 * R2 can be swapped in later behind the same saveUpload/deleteUpload surface.
 */
export async function saveUpload(
  file: File | Blob,
  originalName: string,
): Promise<SavedUpload> {
  const filename = `${randomUUID()}-${safeFilename(originalName)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (useBlob()) {
    const { put } = await import("@vercel/blob");
    const now = new Date();
    const year = String(now.getUTCFullYear());
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const pathname = `uploads/${year}/${month}/${filename}`;
    const blob = await put(pathname, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type || undefined,
    });
    return {
      url: blob.url,
      absolutePath: "",
      relativePath: pathname,
      filename: safeFilename(originalName),
      bytes: buffer.byteLength,
      provider: "blob",
    };
  }

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const relativeDir = path.join("uploads", year, month);
  const relativePath = path.join(relativeDir, filename);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  const absolutePath = path.join(absoluteDir, filename);

  await mkdir(absoluteDir, { recursive: true });
  await writeFile(absolutePath, buffer);

  const url = `/${relativePath.split(path.sep).join("/")}`;

  return {
    url,
    absolutePath,
    relativePath: relativePath.split(path.sep).join("/"),
    filename: safeFilename(originalName),
    bytes: buffer.byteLength,
    provider: "local",
  };
}

function isRemoteBlobUrl(value: string): boolean {
  return (
    /^https?:\/\//i.test(value) &&
    (value.includes("blob.vercel-storage.com") ||
      value.includes("vercel-storage.com") ||
      value.includes("public.blob.vercel-storage.com"))
  );
}

/**
 * Delete a previously saved upload (local public/uploads or Vercel Blob URL).
 */
export async function deleteUpload(relativeOrUrl: string): Promise<void> {
  if (isRemoteBlobUrl(relativeOrUrl)) {
    if (!useBlob()) {
      // Token missing — skip hard failure so admin can still drop the DB row
      return;
    }
    const { del } = await import("@vercel/blob");
    await del(relativeOrUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return;
  }

  const cleaned = relativeOrUrl
    .replace(/^\/+/, "")
    .replace(/^uploads\//, "uploads/");
  const normalized = cleaned.startsWith("uploads/")
    ? cleaned
    : cleaned.startsWith("public/uploads/")
      ? cleaned.slice("public/".length)
      : null;

  if (!normalized || !normalized.startsWith("uploads/")) {
    throw new Error("Silinecek dosya uploads altında değil");
  }

  const absolutePath = path.join(process.cwd(), "public", normalized);
  const resolved = path.resolve(absolutePath);
  if (
    !resolved.startsWith(path.resolve(UPLOADS_ROOT) + path.sep) &&
    resolved !== path.resolve(UPLOADS_ROOT)
  ) {
    throw new Error("Geçersiz dosya yolu");
  }

  try {
    await unlink(resolved);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") throw e;
  }
}
