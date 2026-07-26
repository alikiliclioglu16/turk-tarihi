"use client";

import { useEffect, useRef, useState } from "react";
import { input } from "@/lib/input";

/** Mobil/tablet için sol alt joystick. Yalnız dokunmatik cihazlarda görünür. */
export function Joystick() {
  const alan = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const [dokunmatik, setDokunmatik] = useState(false);

  useEffect(() => {
    setDokunmatik(window.matchMedia?.("(pointer: coarse)").matches ?? false);
  }, []);

  useEffect(() => {
    const el = alan.current;
    if (!el) return;
    let aktifId: number | null = null;

    const merkez = () => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 };
    };
    const guncelle = (cx: number, cy: number) => {
      const m = merkez();
      let dx = (cx - m.x) / m.r;
      let dy = (cy - m.y) / m.r;
      const uz = Math.hypot(dx, dy);
      if (uz > 1) {
        dx /= uz;
        dy /= uz;
      }
      input.joyX = dx;
      input.joyZ = dy;
      if (top.current) top.current.style.transform = `translate(${dx * m.r * 0.5}px, ${dy * m.r * 0.5}px)`;
    };
    const birak = () => {
      aktifId = null;
      input.joyX = 0;
      input.joyZ = 0;
      if (top.current) top.current.style.transform = "translate(0,0)";
    };
    const down = (e: PointerEvent) => {
      aktifId = e.pointerId;
      guncelle(e.clientX, e.clientY);
      e.stopPropagation();
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId === aktifId) guncelle(e.clientX, e.clientY);
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId === aktifId) birak();
    };

    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      birak();
    };
  }, [dokunmatik]);

  if (!dokunmatik) return null;
  return (
    <div className="joystick" ref={alan}>
      <div className="joystick-top" ref={top} />
    </div>
  );
}
