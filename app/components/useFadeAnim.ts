"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade-in once on scroll for `.px-fade-anim` inside `scopeRef`.
 * Respects `data-delay` (seconds).
 * immediateRender:false + refresh so Lenis never leaves sections stuck at opacity 0.
 */
export function useFadeAnim(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(
        scope.querySelectorAll(".px-fade-anim")
      );

      els.forEach((el) => {
        const raw = el.getAttribute("data-delay");
        const delay = raw ? parseFloat(raw) || 0 : 0;

        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            delay,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "bottom top",
              toggleActions: "play none none none",
              once: true,
              // If already scrolled past on refresh, jump to finished state
              onRefresh(self) {
                if (self.progress === 1 || self.start < self.scroll()) {
                  self.animation?.progress(1);
                }
              },
            },
          }
        );
      });
    }, scope);

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    const t1 = window.setTimeout(refresh, 200);
    const t2 = window.setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ctx.revert();
    };
  }, [scopeRef]);
}
