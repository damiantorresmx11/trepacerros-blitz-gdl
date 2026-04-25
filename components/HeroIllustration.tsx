export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ilustracion de montanas y senderos de Guadalajara"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f5e9" />
          <stop offset="100%" stopColor="#fcf9f8" />
        </linearGradient>
        <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#154212" />
          <stop offset="100%" stopColor="#2d5a27" />
        </linearGradient>
        <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d5a27" />
          <stop offset="100%" stopColor="#3b6934" />
        </linearGradient>
        <linearGradient id="mountain3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b6934" />
          <stop offset="100%" stopColor="#72796e" />
        </linearGradient>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#ffb77d" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#sky)" />

      {/* Sun */}
      <circle cx="650" cy="90" r="50" fill="url(#sun)" opacity="0.9" />
      {/* Sun rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1={650 + 60 * Math.cos((angle * Math.PI) / 180)}
          y1={90 + 60 * Math.sin((angle * Math.PI) / 180)}
          x2={650 + 75 * Math.cos((angle * Math.PI) / 180)}
          y2={90 + 75 * Math.sin((angle * Math.PI) / 180)}
          stroke="#FF6B00"
          strokeWidth="2"
          opacity="0.4"
          strokeLinecap="round"
        />
      ))}

      {/* Far mountains (lighter) */}
      <path
        d="M0 280 L80 180 L160 230 L240 150 L320 200 L400 140 L480 190 L560 160 L640 210 L720 170 L800 220 L800 400 L0 400Z"
        fill="url(#mountain3)"
        opacity="0.4"
      />

      {/* Mid mountains */}
      <path
        d="M0 320 L100 220 L180 270 L280 190 L360 250 L440 200 L520 260 L620 210 L700 270 L800 230 L800 400 L0 400Z"
        fill="url(#mountain2)"
        opacity="0.6"
      />

      {/* Front mountains (darkest) */}
      <path
        d="M0 350 L120 260 L200 300 L300 240 L380 290 L460 250 L540 300 L640 260 L740 310 L800 280 L800 400 L0 400Z"
        fill="url(#mountain1)"
        opacity="0.85"
      />

      {/* Pine trees silhouettes */}
      {[80, 160, 290, 410, 530, 680, 750].map((x, i) => {
        const h = 30 + (i % 3) * 12;
        const y = 360 - h * 0.3;
        return (
          <g key={x} opacity={0.5 + (i % 3) * 0.15}>
            <polygon
              points={`${x},${y} ${x - 8},${y + h * 0.6} ${x + 8},${y + h * 0.6}`}
              fill="#154212"
            />
            <polygon
              points={`${x},${y + h * 0.3} ${x - 10},${y + h * 0.8} ${x + 10},${y + h * 0.8}`}
              fill="#154212"
            />
            <rect x={x - 1.5} y={y + h * 0.75} width="3" height={h * 0.25} fill="#154212" />
          </g>
        );
      })}

      {/* Trail path (dotted) */}
      <path
        d="M50 390 Q150 350 250 370 Q350 390 450 360 Q550 330 650 350 Q720 370 780 355"
        stroke="#FF6B00"
        strokeWidth="3"
        strokeDasharray="8 6"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
      />

      {/* Hiker silhouette */}
      <g transform="translate(380, 340)" opacity="0.8">
        {/* Body */}
        <circle cx="0" cy="-22" r="5" fill="#1b1b1c" />
        <line x1="0" y1="-17" x2="0" y2="-4" stroke="#1b1b1c" strokeWidth="2.5" strokeLinecap="round" />
        {/* Legs */}
        <line x1="0" y1="-4" x2="-4" y2="8" stroke="#1b1b1c" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="-4" x2="5" y2="7" stroke="#1b1b1c" strokeWidth="2" strokeLinecap="round" />
        {/* Arms */}
        <line x1="0" y1="-14" x2="-6" y2="-7" stroke="#1b1b1c" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="-14" x2="5" y2="-20" stroke="#1b1b1c" strokeWidth="2" strokeLinecap="round" />
        {/* Walking stick */}
        <line x1="5" y1="-20" x2="8" y2="8" stroke="#7b4100" strokeWidth="1.5" strokeLinecap="round" />
        {/* Backpack */}
        <rect x="-3" y="-16" width="6" height="8" rx="1.5" fill="#2d5a27" opacity="0.8" />
      </g>

      {/* Floating leaves */}
      {[
        { x: 200, y: 120, r: 15 },
        { x: 500, y: 80, r: -20 },
        { x: 350, y: 150, r: 30 },
      ].map(({ x, y, r }, i) => (
        <g key={i} transform={`translate(${x}, ${y}) rotate(${r})`} opacity="0.3">
          <ellipse cx="0" cy="0" rx="8" ry="4" fill="#3b6934" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke="#2d5a27" strokeWidth="0.5" />
        </g>
      ))}

      {/* Eco badge */}
      <g transform="translate(120, 80)">
        <circle cx="0" cy="0" r="20" fill="white" opacity="0.9" />
        <circle cx="0" cy="0" r="18" fill="none" stroke="#2d5a27" strokeWidth="1.5" />
        <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#2d5a27">
          &#x267B;
        </text>
      </g>
    </svg>
  );
}
