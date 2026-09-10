
import type { ZodType } from "zod";
import { ApiError } from "./errors";

export async function parseJson<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    throw new ApiError("Geçersiz JSON gövde", 400);
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiError("Doğrulama hatası", 400, parsed.error.flatten());
  }
  return parsed.data;
}
