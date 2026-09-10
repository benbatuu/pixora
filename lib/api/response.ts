
import { NextResponse } from "next/server";
import { ApiError } from "./errors";
import { AdminAuthError } from "@/lib/admin/require-admin";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function err(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.status },
    );
  }
  console.error("[api]", error);
  return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
}
