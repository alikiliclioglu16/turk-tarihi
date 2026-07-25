"use client";

/**
 * KONTROLLÜ YER TUTUCULAR
 *
 * Görsel dosyaları henüz üretilmemişken sahnenin çökmemesi ve boş
 * görünmemesi için üretilen SVG katmanları. Gerçek WebP geldiğinde
 * manifestteki `hazir` alanı true yapılır; bu bileşenler devreden çıkar.
 */

const P = {
  gece: "#0B1322",
  gece2: "#16233C",
  ufuk: "#2A3F6A",
  dag: "#101C30",
  koz: "#F0A44A",
  alev: "#E5703A",
  kilim: "#B8433A",
  toprak: "#2A3038",
  kece: "#D9CBAA",
};

export function KatmanYerTutucu({ tur }: { tur: string }) {
  switch (tur) {
    case "sky":
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="kat-svg">
          <defs>
            <linearGradient id="gok" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#050A16" />
              <stop offset="0.55" stopColor={P.gece2} />
              <stop offset="1" stopColor={P.ufuk} />
            </linearGradient>
            <radialGradient id="ayHale" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#F2EAD2" stopOpacity="0.55" />
              <stop offset="1" stopColor="#F2EAD2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#gok)" />
          <circle cx="330" cy="170" r="150" fill="url(#ayHale)" />
          <circle cx="330" cy="170" r="46" fill="#F4EDDB" />
          {Array.from({ length: 90 }).map((_, i) => {
            const x = (i * 137.5) % 1600;
            const y = ((i * 91.3) % 420) + 10;
            const r = i % 7 === 0 ? 2.4 : 1.3;
            return <circle key={i} cx={x} cy={y} r={r} fill="#F7EBD3" opacity={0.35 + ((i * 13) % 60) / 100} />;
          })}
        </svg>
      );

    case "bg":
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="kat-svg">
          <path d="M0,470 L170,330 L300,440 L430,300 L560,455 L700,360 L860,470 L1010,320 L1160,450 L1320,340 L1460,460 L1600,380 L1600,900 L0,900 Z" fill={P.dag} opacity="0.85" />
          <path d="M0,540 L220,470 L420,530 L640,460 L880,540 L1120,470 L1360,540 L1600,490 L1600,900 L0,900 Z" fill="#16243C" />
        </svg>
      );

    case "mid":
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="kat-svg">
          {/* uzak otağlar */}
          {[[250, 600, 0.8], [1290, 590, 0.72]].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
              <path d="M-110,0 L-96,-70 L96,-70 L110,0 Z" fill="#1E2B3E" />
              <path d="M-104,-70 L0,-150 L104,-70 Z" fill="#243349" />
              <rect x="-104" y="-52" width="208" height="18" fill={P.kilim} opacity="0.5" />
            </g>
          ))}
          <ellipse cx="800" cy="700" rx="620" ry="120" fill="#1B2434" opacity="0.5" />
        </svg>
      );

    case "mid2":
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="kat-svg">
          {/* ana otağ */}
          <g transform="translate(430,760)">
            <path d="M-180,0 L-160,-140 L160,-140 L180,0 Z" fill="#3A4557" />
            <path d="M-172,-140 L0,-280 L172,-140 Z" fill="#46536A" />
            <rect x="-172" y="-112" width="344" height="34" fill={P.kilim} opacity="0.75" />
            <path d="M-34,0 L-30,-96 L30,-96 L34,0 Z" fill="#141C29" />
          </g>
          {/* ocak ışığı */}
          <g transform="translate(980,780)">
            <ellipse cx="0" cy="0" rx="260" ry="90" fill={P.koz} opacity="0.13" />
            <ellipse cx="0" cy="0" rx="150" ry="52" fill={P.koz} opacity="0.16" />
          </g>
        </svg>
      );

    case "fg":
      return (
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="kat-svg">
          <path d="M0,900 L0,810 Q180,770 340,822 Q520,880 700,834 Q900,780 1120,832 Q1340,884 1600,806 L1600,900 Z" fill="#0D1420" />
          {Array.from({ length: 26 }).map((_, i) => {
            const x = 30 + i * 61;
            const h = 46 + ((i * 37) % 54);
            return (
              <path key={i} d={`M${x},900 Q${x + 8},${900 - h * 0.6} ${x + 16},${900 - h}`}
                stroke="#16202F" strokeWidth="6" fill="none" strokeLinecap="round" />
            );
          })}
        </svg>
      );

    default:
      return null;
  }
}

/** Hotspot nesnesi için silüet yer tutucu */
export function NesneYerTutucu({ tur = "genel" }: { tur?: string }) {
  const ortak = { stroke: "#F7EBD3", strokeWidth: 4, fill: "none", strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 100 100" className="nesne-svg" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#101B2E" opacity="0.55" />
      {tur === "kopuz" && (
        <g {...ortak}>
          <ellipse cx="50" cy="66" rx="17" ry="22" />
          <line x1="50" y1="44" x2="50" y2="16" />
          <line x1="45" y1="18" x2="55" y2="18" />
        </g>
      )}
      {tur === "ates" && (
        <g {...ortak}>
          <path d="M50,22 C60,40 68,48 62,62 C58,72 42,72 38,62 C32,48 40,40 50,22 Z" />
          <line x1="28" y1="78" x2="72" y2="72" />
          <line x1="30" y1="70" x2="70" y2="80" />
        </g>
      )}
      {tur === "otag" && (
        <g {...ortak}>
          <path d="M22,74 L28,44 L72,44 L78,74 Z" />
          <path d="M26,44 L50,20 L74,44" />
          <path d="M44,74 L44,54 L56,54 L56,74" />
        </g>
      )}
      {tur === "sandik" && (
        <g {...ortak}>
          <rect x="24" y="48" width="52" height="30" rx="3" />
          <path d="M24,48 Q50,28 76,48" />
          <line x1="50" y1="40" x2="50" y2="78" />
          <rect x="45" y="52" width="10" height="12" rx="2" />
        </g>
      )}
      {tur === "balbal" && (
        <g {...ortak}>
          <rect x="38" y="26" width="24" height="56" rx="3" />
          <circle cx="50" cy="40" r="8" />
          <line x1="38" y1="62" x2="62" y2="62" />
        </g>
      )}
      {tur === "tas" && (
        <g {...ortak}>
          <path d="M24,70 L34,54 L50,50 L64,58 L74,72 Z" />
          <path d="M34,54 L50,62 L64,58" />
        </g>
      )}
      {tur === "kilim" && (
        <g {...ortak}>
          <rect x="22" y="36" width="56" height="34" rx="2" />
          <path d="M36,53 L50,43 L64,53 L50,63 Z" />
        </g>
      )}
      {tur === "kap" && (
        <g {...ortak}>
          <path d="M30,46 Q50,40 70,46 L64,72 Q50,78 36,72 Z" />
          <line x1="30" y1="46" x2="70" y2="46" />
        </g>
      )}
      {(tur === "genel" || !["kopuz","ates","otag","sandik","balbal","tas","kilim","kap"].includes(tur)) && (
        <g {...ortak}>
          <circle cx="50" cy="50" r="22" />
          <line x1="50" y1="36" x2="50" y2="56" />
          <circle cx="50" cy="64" r="2.5" fill="#F7EBD3" />
        </g>
      )}
    </svg>
  );
}

/** Dede Korkut poz yer tutucusu */
export function RehberYerTutucu({ isaret }: { isaret?: "sol" | "sag" | null }) {
  return (
    <svg viewBox="0 0 300 460" className="rehber-svg" aria-hidden="true">
      <defs>
        <linearGradient id="cubbe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EFE3C8" />
          <stop offset="1" stopColor="#CDBE9C" />
        </linearGradient>
      </defs>
      {/* cübbe */}
      <path d="M150,140 L196,168 L216,430 L84,430 L104,168 Z" fill="url(#cubbe)" />
      {/* pelerin */}
      <path d="M150,138 L206,172 L196,232 L104,232 L94,172 Z" fill={P.kilim} />
      {/* kuşak */}
      <rect x="106" y="256" width="88" height="20" rx="4" fill={P.kilim} />
      <rect x="140" y="256" width="20" height="20" rx="3" fill="#C9A24B" />
      {/* kollar */}
      {isaret === "sag" ? (
        <path d="M196,180 L262,150 L272,168 L206,206 Z" fill="#E4D7BC" />
      ) : isaret === "sol" ? (
        <path d="M104,180 L38,150 L28,168 L94,206 Z" fill="#E4D7BC" />
      ) : (
        <>
          <path d="M104,180 L84,300 L104,306 L120,192 Z" fill="#E4D7BC" />
          <path d="M196,180 L216,300 L196,306 L180,192 Z" fill="#E4D7BC" />
        </>
      )}
      {/* asa */}
      <rect x="212" y="120" width="8" height="300" rx="4" fill="#6E4B26" />
      <circle cx="216" cy="118" r="12" fill="#5A3D20" />
      {/* baş */}
      <circle cx="150" cy="102" r="42" fill="#D9B48F" />
      {/* sakal */}
      <path d="M116,116 Q150,206 184,116 Q184,168 150,182 Q116,168 116,116 Z" fill="#F2EDE2" />
      {/* bıyık */}
      <path d="M132,116 Q150,124 168,116" stroke="#F2EDE2" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* gözler + kaşlar */}
      <circle cx="136" cy="96" r="4.5" fill="#2B2118" />
      <circle cx="164" cy="96" r="4.5" fill="#2B2118" />
      <path d="M128,84 L146,88 M172,84 L154,88" stroke="#F2EDE2" strokeWidth="6" strokeLinecap="round" />
      {/* börk */}
      <path d="M114,72 L150,10 L186,72 Z" fill={P.kilim} />
      <rect x="110" y="66" width="80" height="16" rx="8" fill="#F2EDE2" />
    </svg>
  );
}
