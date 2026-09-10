import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import AdminLoginForm from "@/app/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Giriş",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-4">
      <div className="w-full max-w-md rounded-2xl border border-black/8 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/assets/img/logo/logo-red-uppercase.png"
            alt="Pixora"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </div>
        <h1 className="text-center text-xl font-semibold text-px-black">
          Admin girişi
        </h1>
        <p className="mt-2 text-center text-sm text-px-body">
          Devam etmek için hesabınla giriş yap.
        </p>
        <Suspense fallback={<p className="mt-8 text-center text-sm text-px-body">Yükleniyor…</p>}>
          <AdminLoginForm />
        </Suspense>
        <p className="mt-6 text-center text-xs text-px-body">
          <Link href="/" className="hover:text-px-red">
            ← Siteye dön
          </Link>
        </p>
      </div>
    </div>
  );
}
