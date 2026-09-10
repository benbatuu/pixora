"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

export type CapsuleBall = {
  label: string;
  bg?: string;
  size?: number;
};

type Props = {
  items: CapsuleBall[];
  className?: string;
};

/**
 * Physics scatter for Digital Services capsules:
 * balls drop from above with gravity, collide, and are mouse/touch draggable.
 */
export default function CapsulePhysics({ items, className }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !items.length) return;

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } =
      Matter;

    let disposed = false;
    let engine: Matter.Engine | null = null;
    let runner: Matter.Runner | null = null;
    let mouseConstraint: Matter.MouseConstraint | null = null;
    let raf = 0;
    let ballBodies: Matter.Body[] = [];
    let lastW = 0;
    let lastH = 0;
    let started = false;

    const teardown = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (runner) {
        Runner.stop(runner);
        runner = null;
      }
      if (engine) {
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        engine = null;
      }
      mouseConstraint = null;
      ballBodies = [];
    };

    const syncDom = () => {
      if (disposed || !engine) return;
      ballBodies.forEach((body, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const r = body.circleRadius ?? 80;
        el.style.transform = `translate3d(${body.position.x - r}px, ${body.position.y - r}px, 0) rotate(${body.angle}rad)`;
      });
      raf = requestAnimationFrame(syncDom);
    };

    const build = () => {
      if (disposed) return;
      const w = scene.clientWidth;
      const h = scene.clientHeight;
      if (w < 40 || h < 40) return;
      if (Math.abs(w - lastW) < 8 && Math.abs(h - lastH) < 8 && started) return;
      lastW = w;
      lastH = h;
      started = true;

      teardown();

      engine = Engine.create({
        gravity: { x: 0, y: 1.15, scale: 0.001 },
      });

      const thickness = 100;
      const walls = [
        Bodies.rectangle(w / 2, h + thickness / 2 - 4, w + 400, thickness, {
          isStatic: true,
          friction: 0.45,
        }),
        Bodies.rectangle(-thickness / 2, h / 2, thickness, h * 3, {
          isStatic: true,
        }),
        Bodies.rectangle(w + thickness / 2, h / 2, thickness, h * 3, {
          isStatic: true,
        }),
      ];

      ballBodies = items.map((item, i) => {
        const size =
          typeof window !== "undefined" && window.innerWidth < 992
            ? Math.min(item.size ?? 160, 130)
            : (item.size ?? 160);
        const r = size / 2;
        const el = itemRefs.current[i];
        if (el) {
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
        }
        const slot = items.length <= 1 ? w / 2 : (w * (i + 0.5)) / items.length;
        const x = Math.min(Math.max(slot + (Math.random() * 36 - 18), r + 10), w - r - 10);
        const y = -r - 30 - i * 48 - Math.random() * 60;
        return Bodies.circle(x, y, r, {
          restitution: 0.52,
          friction: 0.22,
          frictionAir: 0.018,
          density: 0.0022,
          label: item.label,
        });
      });

      Composite.add(engine.world, [...walls, ...ballBodies]);

      const mouse = Mouse.create(scene);
      mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.25,
          damping: 0.1,
          render: { visible: false },
        },
      });
      Composite.add(engine.world, mouseConstraint);

      Events.on(mouseConstraint, "startdrag", () => {
        scene.style.cursor = "grabbing";
      });
      Events.on(mouseConstraint, "enddrag", () => {
        scene.style.cursor = "grab";
      });

      runner = Runner.create();
      Runner.run(runner, engine);
      scene.style.cursor = "grab";
      raf = requestAnimationFrame(syncDom);
    };

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => build(), 200);
    });
    ro.observe(scene);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          build();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(scene);

    const boot = window.setTimeout(build, 160);

    return () => {
      disposed = true;
      window.clearTimeout(boot);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      teardown();
    };
  }, [items]);

  return (
    <div
      ref={sceneRef}
      className={className ?? "px-capsule-item-wrapper px-capsule-physics"}
      data-px-throwable-scene="true"
    >
      {items.map((c, i) => {
        const size = c.size ?? 160;
        return (
          <span
            key={`${c.label}-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="px-capsule-item px-capsule-physics-item"
            data-px-throwable-el=""
            style={{
              width: size,
              height: size,
              backgroundColor: c.bg || "#f6f6f6",
              transform: "translate3d(-9999px, -9999px, 0)",
            }}
          >
            {c.label}
          </span>
        );
      })}
    </div>
  );
}
