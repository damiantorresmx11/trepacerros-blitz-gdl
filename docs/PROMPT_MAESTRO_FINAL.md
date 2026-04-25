Contexto: Estoy en el hackathon Monad Blitz Guadalajara 2026. Trabajo solo, llevo 8 horas y son las 4:50am. Tengo el repo en ~/projects/monad-blitz-starter listo con archivos del proyecto Rastros ya copiados a su ubicación.

ESTRUCTURA DEL REPO (Next.js 14 App Router, SIN /src/):
- /app/                  → páginas y layout
- /components/           → componentes (Collection.tsx, MintButton.tsx, RewardsCatalog.tsx, SubmitHike.tsx, etc.)
- /hooks/                → useHikeTracker.ts (ya copiado)
- /lib/                  → wagmi.ts (existente con monadTestnet config)
- /data/                 → rewards.ts, trashTypes.ts (ya copiados)
- /contracts/src/        → 4 .sol (BlitzCollection viejo, PrimaToken, RastroNFT, RewardRegistry)
- /contracts/script/     → Deploy.s.sol nuevo
- /contracts/.env        → ya tiene PRIVATE_KEY válida (mi wallet de Privy con 9.4 MON)
- /.env.local            → tiene NEXT_PUBLIC_PRIVY_APP_ID y NEXT_PUBLIC_CONTRACT_ADDRESS (BlitzCollection viejo - ignorar)

CONTEXTO ESTRATÉGICO:
- Privy ya está configurado en /components/Providers.tsx con login email+google+wallet, embedded wallets, monadTestnet como defaultChain
- /lib/wagmi.ts ya tiene definida la chain monadTestnet (Chain ID 10143)
- Ya logueo, mint y wallet funcionan contra el contrato viejo
- Tengo Pinata JWT guardado en ~/.rastros-pinata-jwt.txt (se va a NEXT_PUBLIC_PINATA_JWT)
- Mi wallet deployer es 0x3D4D55c69F8570Fd3FBA2fBdA039bEc13b53119f
- BlitzCollection viejo deployado en 0x1b5DBEcbfd9FF207e0E49c4a90bA75b601a41396 (lo abandonamos)

PROYECTO RASTROS:
Plataforma donde hikers graban rutas GPS en cerros de Jalisco (La Primavera, Colli, Colomos), recogen basura, mintean NFTs únicos por hike, ganan tokens PRIMA según kg + separación, canjean en 40+ recompensas en 8 categorías.

═══════════════════════════════════════════════════════════════
TAREA: Ejecuta plan en 2 olas con subagents paralelos.
Reporta al final de cada ola y espera confirmación antes de la siguiente.
═══════════════════════════════════════════════════════════════

OLA 1 — FUNDACIONES (6 subagents en paralelo)

Subagent A — CONTRATOS Y DEPLOY:
1. cd contracts && forge install OpenZeppelin/openzeppelin-contracts --no-commit (si no existe ya)
2. Verifica /contracts/foundry.toml tenga remappings correctos
3. Compila los 4 .sol con `forge build`. Si hay errores en BlitzCollection viejo, ignóralo (es legacy). Si los nuevos tienen errores, arréglalos.
4. Carga env: source contracts/.env
5. Deploya con: forge script script/Deploy.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --private-key $PRIVATE_KEY
6. Captura las 3 direcciones (PrimaToken, RastroNFT, RewardRegistry) del output
7. Crea /lib/contracts.ts con:
   export const CONTRACTS = { PRIMA_TOKEN: "0x...", RASTRO_NFT: "0x...", REWARD_REGISTRY: "0x..." } as const;
   export const MONAD_CHAIN_ID = 10143;
8. Crea /lib/abis.ts copiando los ABIs desde /contracts/out/PrimaToken.sol/PrimaToken.json, RastroNFT.json, RewardRegistry.json (solo el array "abi" de cada uno)
9. Reporta las 3 direcciones
Archivos que tocas: /contracts/*, /lib/contracts.ts, /lib/abis.ts
NO TOQUES: /app/*, /components/*, /hooks/*, otros lib/*

Subagent B — HOOK GPS Y VALIDACIÓN:
1. Revisa /hooks/useHikeTracker.ts ya copiado, adapta imports si es necesario
2. Crea /lib/haversine.ts con función standard distancia entre 2 puntos GPS
3. Crea /hooks/useGPSValidation.ts que valide stats antes de submit:
   - distanceMeters >= 1000
   - durationSeconds >= 1800
   - velocidad promedio <= 10 m/s
   - retorna { valid: boolean, reason?: string }
4. Exporta types limpios
Archivos que tocas: /hooks/*, /lib/haversine.ts
NO TOQUES: /app/*, /components/*, /lib/contracts.ts, /lib/abis.ts

Subagent C — SISTEMA DE DISEÑO:
1. Edita /tailwind.config.js o .ts para extender colors:
   primary: "#2A5C3E", accent: "#B8572C", background: "#F5F1E8", foreground: "#1A1A1A", warm: "#FF6B35", muted: "#A8A8A0"
2. Mantén los colores actuales del proyecto (monad-purple, etc.) para no romper componentes viejos
3. Agrega fuentes "Fraunces" y "DM Sans" en /app/layout.tsx (Google Fonts via next/font)
4. Crea /components/ui/Button.tsx, Card.tsx, Badge.tsx (componentes base con variants)
5. Asegura no romper componentes existentes (Collection, MintButton, etc.)
Archivos que tocas: /tailwind.config.js, /app/layout.tsx (solo fuentes), /components/ui/*
NO TOQUES: componentes existentes, globals.css

Subagent D — LANDING PAGE NUEVA:
1. Renombra /app/page.tsx actual a /app/blitz-demo/page.tsx (preserva la demo del BlitzCollection)
2. Crea NUEVA /app/page.tsx para Rastros con:
   - Hero: "RASTROS" tagline "Tus huellas, tu impacto." + CTA "Iniciar mi primer hike"
   - Sección "El problema": 919 incendios Jalisco 2025, La Primavera
   - Sección "Cómo funciona": 4 pasos con emojis grandes
   - Sección "Recompensas": 8 categorías en grid (datos de /data/rewards.ts)
   - Footer minimalista
3. Mobile-first, usa el sistema de diseño del Subagent C
4. Datos mock de stats por ahora (los reales en Ola 2)
Archivos que tocas: /app/page.tsx, /app/blitz-demo/*, /components/landing/*
NO TOQUES: /components/Providers.tsx, /app/layout.tsx (excepto fuentes)

Subagent E — CONTENIDO + DATA:
1. Revisa /data/trashTypes.ts y enriquece campos faltantes (impacto con datos duros, tiempo degradación, ruta disposición en GDL)
2. Crea /data/educativo.ts con:
   - Array de 10 "Datos del día" rotativos
   - Array de 5 "Mitos vs Realidades" del reciclaje
   - Copy del onboarding de seguridad
3. Crea /data/challenges.ts con 7 retos diarios de foto (uno por día)
4. Crea /data/cerros.ts con info de cerros: La Primavera, Colli, Colomos, Metropolitano (descripción, dificultad, distancia típica, accesos)
Archivos que tocas: /data/*
NO TOQUES: código

Subagent F — ENV Y CONFIG:
1. Verifica /.env.local actual
2. Agrega variables faltantes manteniendo las existentes:
   NEXT_PUBLIC_PINATA_JWT=__PEDIR_AL_USUARIO__
   NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
3. Las de contratos (PRIMA_TOKEN, RASTRO_NFT, REWARD_REGISTRY) las llena Subagent A en /lib/contracts.ts
4. Crea /lib/pinata.ts con función uploadToPinata(file: File): Promise<string> que devuelve CID
5. Crea /lib/ipfs.ts con función fetchFromIPFS(cid: string) usando el gateway
Archivos que tocas: /.env.local (agregar líneas), /lib/pinata.ts, /lib/ipfs.ts
NO TOQUES: /lib/wagmi.ts, /lib/contracts.ts, /lib/abis.ts

═══ FIN OLA 1 — REPORTAR ANTES DE OLA 2 ═══
Reporta:
1. Las 3 direcciones de contratos deployados (link al explorer)
2. Errores en cualquier subagent
3. Archivos creados/modificados

DETENTE y espera mi confirmación.

═══════════════════════════════════════════════════════════════

OLA 2 — INTEGRACIÓN (6 subagents en paralelo)

Subagent G — HOOKS ON-CHAIN:
Crea /hooks/useRastros.ts y /hooks/useRewards.ts con wagmi+viem usando ABIs y addresses de /lib/.
Funciones: useMintHike, usePrimaBalance, useUserNFTs, useHikerStats, useRewardsList, useRedeemReward, useUserRedemptions, useApprovePrima.
Patrón estándar { data, isLoading, error, write }.

Subagent H — HIKE MAP:
pnpm add react-leaflet leaflet @types/leaflet
Crea /components/HikeMap.tsx con dynamic import ssr:false, polyline verde primary, markers inicio/fin, autocentrado.
Importa CSS de leaflet.

Subagent I — SUBMIT HIKE END-TO-END:
Adapta /components/SubmitHike.tsx para:
1. Subir foto a Pinata via /lib/pinata.ts
2. Generar metadata JSON estandar OpenSea
3. Subir metadata a Pinata
4. Llamar useMintHike con tokenURI
5. Toast de éxito/error con tx hash + link explorer

Subagent J — PÁGINAS /hike Y /gallery:
/app/hike/page.tsx: integra useHikeTracker + HikeMap + stats vivo + botón stop → SubmitHike modal
/app/gallery/page.tsx: useUserNFTs grid de NFTs con metadata IPFS resuelto

Subagent K — PÁGINAS /rewards Y /profile:
/app/rewards/page.tsx: RewardsCatalog conectado a useRewardsList + useRedeemReward, modal voucher al canjear
/app/profile/page.tsx: dirección, balance PRIMA, stats hiker, vouchers pendientes
Antes del primer redeem, llamar useApprovePrima (MAX_UINT256)

Subagent L — GENERADOR IMAGEN NFT (FEATURE WOW):
/lib/generateNFTImage.ts: usa canvas API, genera 1080x1080 con fondo verde, título "RASTRO #id", polyline mini-mapa, stats overlay, foto polaroid. Sube a Pinata como image del NFT.

═══ FIN OLA 2 — REPORTE FINAL ═══
1. End-to-end test: login → /hike → submit mock → mint → /gallery → /rewards → redeem → /profile
2. Si algo falla, subagent dedicado
3. Commit final descriptivo

REGLAS GLOBALES:
- TypeScript estricto
- Mobile-first
- Comentarios solo no-obvios
- Si subagent atorado >5 min, reportar y seguir
- Commits frecuentes cada milestone
