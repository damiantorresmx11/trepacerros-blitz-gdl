export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ilustracion de montanas y senderos de Guadalajara"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbeee0" />
          <stop offset="60%" stopColor="#f0f7ec" />
          <stop offset="100%" stopColor="#fcf9f8" />
        </linearGradient>
        <linearGradient id="mtn-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8c9b5" />
          <stop offset="100%" stopColor="#c8d6c4" />
        </linearGradient>
        <linearGradient id="mtn-mid-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8aab82" />
          <stop offset="100%" stopColor="#a0bf98" />
        </linearGradient>
        <linearGradient id="mtn-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6FA88B" />
          <stop offset="100%" stopColor="#88b89e" />
        </linearGradient>
        <linearGradient id="mtn-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A7C5E" />
          <stop offset="100%" stopColor="#5d9070" />
        </linearGradient>
        <linearGradient id="mtn-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A5C3E" />
          <stop offset="100%" stopColor="#3b6d4e" />
        </linearGradient>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#FF6B00" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sun-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFAD5C" />
          <stop offset="50%" stopColor="#FF8A2B" />
          <stop offset="100%" stopColor="#FF6B00" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#sky)" />

      {/* Sun glow */}
      <circle cx="640" cy="85" r="100" fill="url(#sun-glow)" />
      <circle cx="640" cy="85" r="55" fill="url(#sun-glow)" />
      {/* Sun core */}
      <circle cx="640" cy="85" r="32" fill="url(#sun-core)" />
      <circle cx="640" cy="85" r="36" fill="none" stroke="#FF6B00" strokeWidth="1" opacity="0.25" />

      {/* Layer 1: Far mountains (lightest) */}
      <path
        d="M0 260 L60 200 L120 230 L180 185 L250 215 L320 175 L390 210 L460 180 L530 220 L600 190 L670 225 L740 195 L800 215 L800 400 L0 400Z"
        fill="url(#mtn-far)"
        opacity="0.5"
      />

      {/* Layer 2: Mid-far mountains */}
      <path
        d="M0 290 L70 225 L140 260 L220 200 L300 245 L370 210 L450 250 L530 215 L610 255 L690 225 L770 250 L800 240 L800 400 L0 400Z"
        fill="url(#mtn-mid-far)"
        opacity="0.55"
      />

      {/* Layer 3: Mid mountains */}
      <path
        d="M0 310 L90 240 L170 275 L260 220 L340 260 L420 230 L510 270 L590 240 L680 265 L760 245 L800 260 L800 400 L0 400Z"
        fill="url(#mtn-mid)"
        opacity="0.7"
      />

      {/* Layer 4: Near mountains */}
      <path
        d="M0 340 L100 270 L190 305 L280 255 L370 290 L450 265 L540 300 L630 270 L720 295 L800 275 L800 400 L0 400Z"
        fill="url(#mtn-near)"
        opacity="0.85"
      />

      {/* Layer 5: Foreground hills (darkest) */}
      <path
        d="M0 365 L80 320 L160 345 L250 310 L340 335 L430 315 L520 340 L610 320 L700 345 L780 325 L800 335 L800 400 L0 400Z"
        fill="url(#mtn-front)"
      />

      {/* Trail path (serpentine) */}
      <path
        d="M40 392 Q100 370 160 380 Q230 392 300 372 Q370 352 440 365 Q510 378 580 360 Q650 342 720 355 Q760 363 790 358"
        stroke="#FF6B00"
        strokeWidth="2.5"
        strokeDasharray="6 5"
        fill="none"
        opacity="0.6"
        strokeLinecap="round"
      />

      {/* Detailed pine trees */}
      {[
        { x: 55, s: 1.1 }, { x: 120, s: 0.85 }, { x: 195, s: 1.0 },
        { x: 310, s: 0.9 }, { x: 385, s: 1.15 },
        { x: 505, s: 0.95 }, { x: 590, s: 1.05 },
        { x: 680, s: 0.8 }, { x: 745, s: 1.0 },
      ].map(({ x, s }, i) => {
        const baseY = 370;
        const h = 38 * s;
        return (
          <g key={`tree-${i}`} opacity={0.75 + (i % 3) * 0.08}>
            {/* Trunk */}
            <rect x={x - 1.5} y={baseY - h * 0.25} width="3" height={h * 0.3} fill="#3b5230" rx="1" />
            {/* Bottom layer */}
            <polygon points={`${x},${baseY - h * 0.35} ${x - 10 * s},${baseY - h * 0.05} ${x + 10 * s},${baseY - h * 0.05}`} fill="#2A5C3E" />
            {/* Middle layer */}
            <polygon points={`${x},${baseY - h * 0.6} ${x - 8 * s},${baseY - h * 0.25} ${x + 8 * s},${baseY - h * 0.25}`} fill="#2A5C3E" />
            {/* Top layer */}
            <polygon points={`${x},${baseY - h * 0.9} ${x - 5.5 * s},${baseY - h * 0.5} ${x + 5.5 * s},${baseY - h * 0.5}`} fill="#2A5C3E" />
          </g>
        );
      })}

      {/* Hiker 1 (main, on trail) */}
      <g transform="translate(420, 348)" opacity="0.85">
        <circle cx="0" cy="-20" r="4.5" fill="#1b1b1c" />
        <line x1="0" y1="-15.5" x2="0" y2="-3" stroke="#1b1b1c" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0" y1="-3" x2="-4" y2="8" stroke="#1b1b1c" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="-3" x2="5" y2="7" stroke="#1b1b1c" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="-12" x2="-5" y2="-6" stroke="#1b1b1c" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="0" y1="-12" x2="5" y2="-18" stroke="#1b1b1c" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="5" y1="-18" x2="7" y2="8" stroke="#7b4100" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="-3" y="-15" width="5.5" height="7" rx="1.5" fill="#2d5a27" opacity="0.85" />
      </g>

      {/* Hiker 2 (smaller, further back) */}
      <g transform="translate(280, 360) scale(0.7)" opacity="0.55">
        <circle cx="0" cy="-20" r="4.5" fill="#1b1b1c" />
        <line x1="0" y1="-15.5" x2="0" y2="-3" stroke="#1b1b1c" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0" y1="-3" x2="-3" y2="8" stroke="#1b1b1c" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="-3" x2="4" y2="7" stroke="#1b1b1c" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="-12" x2="-5" y2="-6" stroke="#1b1b1c" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="0" y1="-12" x2="4" y2="-17" stroke="#1b1b1c" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="-2.5" y="-15" width="5" height="7" rx="1.5" fill="#4A7C5E" opacity="0.85" />
      </g>

      {/* Hiker 3 (even smaller, far back) */}
      <g transform="translate(580, 348) scale(0.6)" opacity="0.4">
        <circle cx="0" cy="-20" r="4.5" fill="#1b1b1c" />
        <line x1="0" y1="-15.5" x2="0" y2="-3" stroke="#1b1b1c" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0" y1="-3" x2="-3" y2="8" stroke="#1b1b1c" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="-3" x2="4" y2="7" stroke="#1b1b1c" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="-12" x2="-5" y2="-6" stroke="#1b1b1c" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="0" y1="-12" x2="5" y2="-18" stroke="#1b1b1c" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="5" y1="-18" x2="7" y2="8" stroke="#7b4100" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Subtle floating leaves */}
      {[
        { x: 180, y: 130, r: 20, o: 0.15 },
        { x: 450, y: 100, r: -15, o: 0.12 },
        { x: 350, y: 160, r: 35, o: 0.1 },
        { x: 560, y: 140, r: -25, o: 0.1 },
      ].map(({ x, y, r, o }, i) => (
        <g key={`leaf-${i}`} transform={`translate(${x}, ${y}) rotate(${r})`} opacity={o}>
          <ellipse cx="0" cy="0" rx="7" ry="3.5" fill="#4A7C5E" />
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#2A5C3E" strokeWidth="0.4" />
        </g>
      ))}
    </svg>
  );
}
