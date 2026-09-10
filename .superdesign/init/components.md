# Shared UI components

Pixora is a marketing site with **no shadcn/ui or generic admin primitives**. Shared pieces are site chrome and section components.

There is **no existing admin Button/Input/Table library**. Admin designs should invent clean Tailwind primitives consistent with theme tokens (black/red/white, Inter, rounded-full CTAs for primary actions, subtle borders `#1112141a`).

## SiteChrome — `app/components/SiteChrome.tsx`
Wraps Header + PageTransition + Footer + BackToTop for public routes.
```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import PageTransition from "./PageTransition";

gsap.registerPlugin(ScrollTrigger);

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    const t1 = window.setTimeout(refresh, 150);
    const t2 = window.setTimeout(refresh, 500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return (
    <>
      <Header />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <BackToTop />
    </>
  );
}

```

## Header — `app/components/Header.tsx` (excerpt: public marketing header, not admin)
Public fixed header with logo + hamburger offcanvas. Admin should NOT reuse this shell — use a dedicated admin sidebar layout.
(Full file ~252 lines — key brand: logo `/assets/img/logo/logo-red-uppercase.png`, red `#e11010`, offcanvas dark smoke video.)

## Footer — `app/components/Footer.tsx`
Dark footer `#0a0a0a` with white text, social pills, quick links, contact, large Thunder "PIXORA" copyright wordmark in red.
