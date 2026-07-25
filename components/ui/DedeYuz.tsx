export function DedeYuz({ boyut = 44 }: { boyut?: number }) {
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 64 64" aria-label="Dede Korkut">
      <circle cx="32" cy="32" r="31" fill="#2A3B5E" stroke="#F0A44A" strokeWidth="2.5" />
      <path d="M14,44 Q32,20 50,44 L50,54 Q32,64 14,54 Z" fill="#F7EBD3" />
      <circle cx="32" cy="30" r="12" fill="#E8C9A8" />
      <path d="M18,26 Q32,12 46,26 Q46,18 32,14 Q18,18 18,26 Z" fill="#B8433A" />
      <circle cx="27" cy="29" r="1.8" fill="#2A2118" />
      <circle cx="37" cy="29" r="1.8" fill="#2A2118" />
      <path d="M24,34 Q32,50 40,34 L40,42 Q32,52 24,42 Z" fill="#F7EBD3" />
    </svg>
  );
}
