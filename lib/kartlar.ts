/** Kart görselleri — ChatGPT seti, public/assets/d01/cards/ */
export function kartGorseli(cardId: string): string | null {
  const m = cardId.match(/card_(\d{2})/);
  if (!m) return null;
  return `/assets/d01/cards/d01_card_${m[1]}.webp`;
}
