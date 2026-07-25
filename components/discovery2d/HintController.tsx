"use client";

/**
 * İPUCU KATMANI
 * JSON'daki hints dizisi 2. ve 4. denemede açılır. Metin koda gömülmez.
 */
export function HintController({ ipucu, deneme }: { ipucu: string | null; deneme: number }) {
  if (!ipucu) return null;
  return (
    <div className="ipucu-kutu" role="status">
      <span className="ipucu-ikon" aria-hidden="true">💡</span>
      <div>
        <div className="ipucu-baslik">
          {deneme >= 4 ? "Dede Korkut yol gösteriyor" : "Küçük bir ipucu"}
        </div>
        <p>{ipucu}</p>
      </div>
    </div>
  );
}
