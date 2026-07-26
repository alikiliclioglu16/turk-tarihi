"use client";

import { useEffect, useState } from "react";

/**
 * MOBİL KONTROLLER
 *
 * Dokunmatik cihazlarda koş, zıpla ve otur düğmeleri. Masaüstünde
 * gizlidir (Shift, Space, Ctrl tuşları zaten var).
 * Düğmeler klavye olayı üretir; oyun mantığı tek yerde kalır.
 */
export function MobilKontroller() {
  const [dokunmatik, setDokunmatik] = useState(false);

  useEffect(() => {
    setDokunmatik(window.matchMedia?.("(pointer: coarse)").matches ?? false);
  }, []);

  if (!dokunmatik) return null;

  const gonder = (tip: "keydown" | "keyup", kod: string, shift = false) => {
    window.dispatchEvent(new KeyboardEvent(tip, { code: kod, key: kod, shiftKey: shift, bubbles: true }));
  };

  return (
    <div className="mobil-dugmeler">
      <button
        className="mobil-dugme"
        aria-label="Koş"
        onPointerDown={() => gonder("keydown", "ShiftLeft", true)}
        onPointerUp={() => gonder("keyup", "ShiftLeft", false)}
        onPointerLeave={() => gonder("keyup", "ShiftLeft", false)}
      >⏩</button>
      <button
        className="mobil-dugme"
        aria-label="Zıpla"
        onPointerDown={() => gonder("keydown", "Space")}
        onPointerUp={() => gonder("keyup", "Space")}
      >⤴</button>
      <button
        className="mobil-dugme"
        aria-label="Otur"
        onPointerDown={() => gonder("keydown", "ControlLeft")}
        onPointerUp={() => gonder("keyup", "ControlLeft")}
      >🪑</button>
    </div>
  );
}
