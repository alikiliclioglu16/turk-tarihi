/**
 * Girdi durumu React state'i DIŞINDA tutulur.
 * Sebep: her klavye/joystick hareketinde yeniden render olmasın.
 */
export const input = {
  x: 0,       // -1 sol, +1 sağ
  z: 0,       // -1 ileri, +1 geri
  joyX: 0,
  joyZ: 0,
  kilitli: false, // anlatı/görev sırasında hareket kilidi
};

const basili = new Set<string>();

function guncelle() {
  let x = 0;
  let z = 0;
  // Yönler kamera arkası bakışa göre düzeltildi:
  // yukarı = kameranın baktığı yöne git, sağ = sağa git.
  if (basili.has("arrowup") || basili.has("w")) z += 1;
  if (basili.has("arrowdown") || basili.has("s")) z -= 1;
  if (basili.has("arrowleft") || basili.has("a")) x += 1;
  if (basili.has("arrowright") || basili.has("d")) x -= 1;
  input.x = x;
  input.z = z;
}

export function klavyeyiBagla(): () => void {
  const down = (e: KeyboardEvent) => {
    basili.add(e.key.toLowerCase());
    guncelle();
  };
  const up = (e: KeyboardEvent) => {
    basili.delete(e.key.toLowerCase());
    guncelle();
  };
  const blur = () => {
    basili.clear();
    guncelle();
  };
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", blur);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", blur);
  };
}

/** Toplam hareket girdisi (klavye + joystick) */
export function hareketVektoru(): { x: number; z: number } {
  if (input.kilitli) return { x: 0, z: 0 };
  return { x: input.x + input.joyX, z: input.z + input.joyZ };
}
