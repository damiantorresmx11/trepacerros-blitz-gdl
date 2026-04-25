# Prompt Maestro — Orquestación de Subagents para Rastros

Este es el prompt que le pegas al **Claude Code principal** (parent) al inicio del evento. Los subagents se spawneán desde ahí.

## Setup previo (tú haces esto manualmente antes del prompt)

```bash
# Clonas el starter
git clone https://github.com/fruteroclub/monad-blitz-starter rastros
cd rastros
pnpm install

# Copias los archivos del ZIP que te entregué
cp -r ~/Downloads/rastros/contracts/* ./contracts/
cp -r ~/Downloads/rastros/frontend/* ./frontend/
cp ~/Downloads/rastros/docs/* ./docs/
cp ~/Downloads/rastros/README.md .

# Abres Claude Code
claude
```

Una vez abierto Claude Code, le pegas el prompt completo de abajo.

---

## PROMPT MAESTRO (pegar completo al parent Claude Code)

```
Contexto: Estoy en el hackathon Monad Blitz Guadalajara 2026. Tengo 4 horas
netas para shippear un proyecto completo. Tengo los archivos base en ./docs,
./contracts y ./frontend. Necesito que orquestes subagents en dos olas para
paralelizar el trabajo.

El proyecto se llama "Rastros". Es una plataforma donde hikers graban sus 
rutas GPS, recogen basura en senderos, mintean NFTs únicos de cada hike en 
Monad testnet, y canjean tokens PRIMA por recompensas en 8 categorías 
(chela, café, eventos, outdoor, donaciones, etc).

Stack: Next.js 14 + Privy + Foundry + Solidity + Monad testnet + Pinata IPFS.

Archivos de referencia ya presentes en el repo:
- /contracts/PrimaToken.sol — ERC20
- /contracts/RastroNFT.sol — ERC721 del hike
- /contracts/RewardRegistry.sol — catálogo
- /contracts/Deploy.s.sol — script con seed de 40+ recompensas
- /frontend/components/useHikeTracker.tsx — hook de GPS
- /frontend/components/SubmitHike.tsx — form de submit
- /frontend/components/RewardsCatalog.tsx — UI del catálogo
- /frontend/data/trashTypes.ts — 12 tipos de basura con info científica
- /frontend/data/rewards.ts — 40 recompensas para el frontend

Direcciones que NO tengo todavía: direcciones deployadas de los contratos.
Deberás tratarlas como variables de entorno (NEXT_PUBLIC_RASTRO_NFT, etc)
que se llenan DESPUÉS del deploy.

Tu tarea: Ejecutar el plan en 2 olas. Cada ola son subagents paralelos. 
Al terminar cada ola, me reportas antes de la siguiente.

═══════════════════════════════════════════════════════════════
OLA 1 — FUNDACIONES INDEPENDIENTES (sin dependencias cruzadas)
═══════════════════════════════════════════════════════════════

Spawnea estos 6 subagents EN PARALELO. Cada uno trabaja en su área sin 
tocar las de otros.

--- Subagent A: CONTRATOS Y DEPLOY ---

Tarea: 
1. Instala OpenZeppelin: forge install OpenZeppelin/openzeppelin-contracts --no-commit
2. Configura foundry.toml con remappings para OZ
3. Compila los 3 .sol en /contracts con `forge build`. Arregla errores si hay.
4. Corre el deploy script a Monad testnet:
   forge script script/Deploy.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --private-key $PRIVATE_KEY
5. Captura las 3 direcciones del output
6. Crea /src/constants.ts con:
   export const CONTRACTS = {
     PRIMA_TOKEN: "0x...",
     RASTRO_NFT: "0x...",
     REWARD_REGISTRY: "0x..."
   };
7. Copia los ABIs generados (./out/*.json) a /src/abis/
8. Reporta: las 3 direcciones + confirmación de que se ven en 
   https://testnet.monadexplorer.com

Archivos que tocas: /contracts/*, /script/*, /foundry.toml, /src/constants.ts, /src/abis/*
NO toques: /frontend/*, /src/app/*, /src/components/*

--- Subagent B: HOOK GPS + INTEGRACIÓN ---

Tarea:
1. Copia /frontend/components/useHikeTracker.tsx a /src/hooks/useHikeTracker.ts
2. Adapta imports según estructura del proyecto
3. Crea /src/hooks/useGPSValidation.ts que valide los stats ANTES de 
   enviar al contrato (distancia >=1km, duración >=30min, velocidad <=10m/s)
4. Crea /src/lib/haversine.ts con la formula estándar para cálculo de 
   distancia entre puntos GPS
5. Exporta todo limpio con TypeScript types

Archivos que tocas: /src/hooks/*, /src/lib/*
NO toques: /src/components/*, /src/app/*

--- Subagent C: SISTEMA DE DISEÑO GLOBAL ---

Tarea:
1. Configura /tailwind.config.ts con paleta:
   - primary: "#2A5C3E" (verde encino)
   - accent: "#B8572C" (tierra rojiza)
   - background: "#F5F1E8" (crema hueso)
   - foreground: "#1A1A1A" (negro carbón)
   - warm: "#FF6B35" (naranja atardecer)
   - muted: "#A8A8A0" (gris neblina)
2. Importa fuentes "Fraunces" (headings) y "DM Sans" (body) en /src/app/layout.tsx
3. Crea /src/components/ui/Button.tsx, Card.tsx, Badge.tsx, Input.tsx 
   como componentes base reutilizables
4. Crea /src/styles/globals.css con estilos base cohesivos

Archivos que tocas: /tailwind.config.ts, /src/app/layout.tsx (solo la parte 
de fuentes), /src/components/ui/*, /src/styles/*
NO toques: /src/components/hike/*, /src/components/rewards/*, /src/hooks/*

--- Subagent D: LANDING PAGE SKELETON ---

Tarea:
1. Crea /src/app/page.tsx con landing:
   - Hero: título "RASTROS" grande + tagline "Tus huellas, tu impacto" + CTA
   - Sección "Cómo funciona" con 4 pasos (ilustrados con emojis)
   - Sección "Recompensas" con las 8 categorías en grid
   - Footer con créditos
2. Usa datos MOCK por ahora (los stats reales los trae otro subagent en Ola 2)
3. Responsive mobile-first

Archivos que tocas: /src/app/page.tsx, /src/components/landing/*
NO toques: /src/hooks/*, /src/components/hike/*

--- Subagent E: CONTENIDO EDUCATIVO + COPY ---

Tarea:
1. Lee /frontend/data/trashTypes.ts y enriquecelo con más detalles donde 
   falten (especialmente el campo "impacto" con datos duros citables)
2. Crea /src/data/educativo.ts con:
   - Array de "Datos del día" para mostrar rotativamente en la app
     Ej: "Una colilla contamina hasta 50 litros de agua"
   - Array de "Mitos vs Realidades" del reciclaje
   - Copy del onboarding de seguridad (video de 30s guion)
3. Crea /src/data/challenges.ts con los 7 retos diarios de foto

Archivos que tocas: /src/data/*
NO toques: código, solo contenido y data

--- Subagent F: SETUP PRIVY + MONAD CUSTOM CHAIN ---

Tarea:
1. Verifica que el starter tenga @privy-io/react-auth instalado. Si no, 
   instálalo.
2. Configura /src/providers/PrivyProvider.tsx con:
   - appId desde NEXT_PUBLIC_PRIVY_APP_ID
   - Login methods: ["email", "google", "wallet"]
   - Embedded wallets: createOnLogin: "users-without-wallets"
   - defaultChain: Monad Testnet (Chain ID 10143)
3. Define la chain custom:
   const monadTestnet = {
     id: 10143,
     name: "Monad Testnet",
     network: "monad-testnet",
     nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
     rpcUrls: {
       default: { http: ["https://testnet-rpc.monad.xyz"] },
       public: { http: ["https://testnet-rpc.monad.xyz"] }
     },
     blockExplorers: {
       default: { name: "Monad", url: "https://testnet.monadexplorer.com" }
     }
   };
4. Envuelve /src/app/layout.tsx con el PrivyProvider
5. Crea un componente /src/components/ConnectButton.tsx que muestre "Login" 
   si no está autenticado, o la dirección truncada + balance si sí

Archivos que tocas: /src/providers/*, /src/app/layout.tsx (solo parte del 
provider), /src/components/ConnectButton.tsx
NO toques: otros components, hooks, páginas

═══════════════════════════════════════════════════════════════
REPORTE DE OLA 1
═══════════════════════════════════════════════════════════════

Cuando los 6 subagents terminen, reportame:
- Las 3 direcciones de contratos
- Si hubo errores en algún subagent
- Qué archivos se crearon/modificaron

DETENTE y espera mi confirmación antes de continuar con Ola 2.

═══════════════════════════════════════════════════════════════
OLA 2 — INTEGRACIÓN CON DEPENDENCIAS RESUELTAS
═══════════════════════════════════════════════════════════════

Una vez confirme que Ola 1 terminó bien, spawnea estos 6 subagents en paralelo.
Ahora sí tienen las direcciones de contratos, los hooks, los estilos.

--- Subagent G: HOOKS ON-CHAIN ---

Tarea:
1. Lee /src/constants.ts para las direcciones
2. Lee /src/abis/* para los ABIs
3. Crea /src/hooks/useRastros.ts con:
   - useMintHike() — llama RastroNFT.mintRastro() con wagmi/viem
   - usePrimaBalance(address) — query del balance
   - useUserNFTs(address) — lista NFTs del usuario
   - useHikerStats(address) — kg totales y hikes count
4. Crea /src/hooks/useRewards.ts con:
   - useRewardsList(category) — lista rewards de una categoría
   - useRedeemReward(rewardId) — llama RewardRegistry.redeemReward()
   - useUserRedemptions(address) — lista de vouchers del usuario
5. Todos los hooks devuelven { data, isLoading, error, mutate } 
   (patrón estándar)
6. Usa el wallet de Privy para firmar

Archivos que tocas: /src/hooks/useRastros.ts, /src/hooks/useRewards.ts
NO toques: componentes o páginas

--- Subagent H: HIKE MAP CON LEAFLET ---

Tarea:
1. Instala: pnpm add react-leaflet leaflet && pnpm add -D @types/leaflet
2. Crea /src/components/hike/HikeMap.tsx que:
   - Recibe props { points: Array<{lat, lng}>, isTracking: boolean }
   - Renderiza mapa Leaflet con tiles OpenStreetMap
   - Dibuja Polyline con los puntos en color verde (#2A5C3E)
   - Marker de inicio (verde) y marker final (rojo)
   - Centra automáticamente en el último punto
   - Actualiza en tiempo real cuando llegan puntos
3. IMPORTANTE: usa dynamic import con ssr: false en la página que lo use
4. Incluye leaflet CSS

Archivos que tocas: /src/components/hike/HikeMap.tsx, /package.json
NO toques: otros componentes

--- Subagent I: SUBMIT HIKE CON UPLOAD IPFS Y MINT ---

Tarea:
1. Copia /frontend/components/SubmitHike.tsx a /src/components/hike/SubmitHike.tsx
2. Adapta imports
3. Integra upload a Pinata IPFS:
   - Función uploadToPinata(file): Promise<string> que devuelve CID
   - Endpoint: https://api.pinata.cloud/pinning/pinFileToIPFS
   - JWT desde NEXT_PUBLIC_PINATA_JWT
4. Flujo completo al submit:
   a. Subir foto a Pinata → cidFoto
   b. Armar metadata JSON { name, description, image: "ipfs://"+cidFoto, 
      attributes: [{distance, duration, trashKg, trashType, trail}] }
   c. Subir metadata a Pinata → cidMeta
   d. Llamar useMintHike() con cidMeta como tokenURI
   e. Mostrar toast con hash de transacción
5. Si falla, mostrar error claro al usuario

Archivos que tocas: /src/components/hike/SubmitHike.tsx, /src/lib/pinata.ts
NO toques: hooks (los usa), map

--- Subagent J: PÁGINA /hike + /gallery ---

Tarea:
1. Crea /src/app/hike/page.tsx que integre:
   - useHikeTracker (estado tracking)
   - <HikeMap> dibujando la ruta
   - Stats en vivo (distancia, tiempo, velocidad)
   - Botón "Detener hike" que muestra <SubmitHike>
   - Redirect a /gallery después de mint exitoso
2. Crea /src/app/gallery/page.tsx que:
   - Usa useUserNFTs() para listar NFTs del usuario
   - Fetchea metadata de cada uno (ipfs:// → gateway https)
   - Muestra grid de cards: imagen + nombre + stats + link al explorer
3. Mobile-first, diseño cohesivo con el sistema del Subagent C

Archivos que tocas: /src/app/hike/*, /src/app/gallery/*
NO toques: hooks, componentes core

--- Subagent K: PÁGINA /rewards + FLUJO DE CANJE ---

Tarea:
1. Crea /src/app/rewards/page.tsx que integre:
   - <RewardsCatalog /> (ya existe en /frontend/components)
   - Balance PRIMA en el header
   - Filtro por categoría
   - Al canjear: mostrar modal con voucher code + QR para el sponsor
2. Crea /src/app/profile/page.tsx que muestra:
   - Dirección del usuario
   - Balance PRIMA
   - Stats (kg totales, hikes count)
   - Lista de vouchers pendientes
3. Antes del primer redeem, llamar primaToken.approve() al registry 
   con MAX_UINT256

Archivos que tocas: /src/app/rewards/*, /src/app/profile/*, /src/components/rewards/*
NO toques: hooks, contratos

--- Subagent L: FEATURE WOW — GENERADOR DE IMAGEN NFT ---

Tarea:
1. Crea /src/lib/generateNFTImage.ts que usando canvas API (o satori si está 
   disponible en el proyecto) genere una imagen de 1080x1080px con:
   - Fondo verde oscuro con textura sutil
   - Título: "RASTRO #[tokenId]"
   - Mapa de la ruta dibujado con la polyline de puntos GPS
   - Stats overlay (distancia, tiempo, kg, cerro) en esquinas
   - Foto de basura como mini-polaroid
   - Logo "RASTROS" abajo
2. La función se llama DURANTE el submit del hike, antes de subir metadata
3. Sube esta imagen generada a Pinata como el "image" del NFT
4. Debe verse bonito para compartir en redes sociales

Archivos que tocas: /src/lib/generateNFTImage.ts
NO toques: el resto

═══════════════════════════════════════════════════════════════
REPORTE FINAL DE OLA 2
═══════════════════════════════════════════════════════════════

Cuando los 6 subagents de Ola 2 terminen:
1. Hagamos un test end-to-end juntos:
   - Login con Privy
   - Iniciar hike en /hike
   - (simular con datos mock si no hay GPS real en laptop)
   - Submit → mint
   - Ver NFT en /gallery
   - Canjear reward en /rewards
   - Ver voucher en /profile
2. Si algo falla, arréglalo con un subagent adicional enfocado en ese bug
3. Cuando todo funcione, hagamos commit final y push a main

═══════════════════════════════════════════════════════════════

REGLAS GENERALES PARA TODOS LOS SUBAGENTS:
- Código limpio, TypeScript estricto
- Mobile-first (el hackathon se pitchea con celular)
- Comentarios solo donde es no-obvio
- Si un subagent encuentra un error que no puede resolver en 5 min, 
  reportarlo en lugar de trabarse
- Commits descriptivos cada feature terminado

Arrancamos con Ola 1. Confirma que entendiste el plan y comienza.
```

---

## Cómo monitorear progreso

Una vez el parent está ejecutando subagents, tú:

1. **Observas la terminal del parent** — te va mostrando qué subagent está haciendo qué
2. **No intervienes a menos que veas algo mal** — déjalos trabajar
3. **Cuando el parent reporta "Ola 1 completa"**, revisa:
   - ¿Contratos deployados? Verifica en https://testnet.monadexplorer.com
   - ¿Archivos creados en las ubicaciones correctas?
   - ¿Hay errores de compilación?
4. **Confirmas o pides ajustes**: "Todo bien, arranca Ola 2" o "El subagent C puso las fuentes mal, fíxalo y sigamos"
5. **Observas Ola 2** igual

## Si algún subagent falla

Le dices al parent:

```
El subagent [X] falló porque [razón]. Crea un nuevo subagent que:
1. Revise el estado actual de [archivo/área]
2. Arregle [problema específico]
3. Reporte cuando termine
```

No reinicies todo. Solo el que falló.

## Tips finales

**1. Compacta contexto del parent regularmente**
Cuando veas que la conversación se alarga, escribe `/compact` para que Claude Code compacte su historia y libere contexto.

**2. Guarda screenshots del reporte final de cada ola**
Por si necesitas referencia de qué se construyó.

**3. Tu laptop va a calentarse**
10 subagents en paralelo = mucho CPU. Ten cargador + mesa con ventilación.

**4. Ten cuidado con comandos de shell**
Los subagents pueden ejecutar comandos. Cuando pidas deploy o install de deps, verifica que el output no tenga errores de red/permisos.

**5. Haz commit frecuente desde el parent**
Pídele: "Haz commit de lo que llevamos con mensaje descriptivo."
