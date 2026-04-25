# Prompts para Claude Code — Rastros (Blitz GDL 2026)

Estos son los prompts optimizados para que le pidas a Claude Code cada pedazo del proyecto durante el hackathon. Están ordenados por prioridad y dependencias.

---

## HORA 1 — Setup inicial

### Prompt 1.1: Clonar y analizar el starter
```
Clona el repo https://github.com/fruteroclub/monad-blitz-starter en ./rastros.
Instala dependencias con pnpm install (o npm si no hay pnpm).
Revisa la estructura y dime:
1. Qué stack usa (Next.js version, Privy version, etc.)
2. Qué contratos trae como ejemplo
3. Qué variables de entorno necesito en .env
4. Si el deploy script existe y cómo se usa
```

### Prompt 1.2: Setup de Foundry y .env
```
Crea un .env.local en la raíz con estas variables:
- NEXT_PUBLIC_MONAD_RPC=https://testnet-rpc.monad.xyz
- NEXT_PUBLIC_CHAIN_ID=10143
- NEXT_PUBLIC_PRIVY_APP_ID=[lo pongo yo después]
- PRIVATE_KEY=[la de mi wallet con MON de faucet]

Verifica que Foundry esté instalado con `forge --version`.
Si no, instálalo con:
curl -L https://foundry.paradigm.xyz | bash && foundryup

Crea la estructura de carpetas:
./contracts (para mis .sol)
./script (para deploy)
./frontend (Next.js del starter)
```

---

## HORA 2 — Contratos

### Prompt 2.1: Escribir los 3 contratos
```
Escribe 3 contratos Solidity en ./contracts:

1. PrimaToken.sol — ERC20 simple con OpenZeppelin. Tiene minter y burner asignables por el owner. Solo minter puede mint, solo burner puede burn.

2. RastroNFT.sol — ERC721 con URIStorage. Tiene:
   - Enum TrashType (MIXED, PET, GLASS, METAL, ORGANIC, HAZARDOUS_REPORT)
   - Enum TrailType (PRIMAVERA, COLLI, COLOMOS, METROPOLITANO, OTHER)
   - Struct Rastro con: hiker, distanceMeters, durationSeconds, trashGrams, trashType, trailType, officialCheckpoint, timestamp
   - Función mintRastro() que valida:
     * distanceMeters >= 1000 (mínimo 1 km)
     * durationSeconds >= 1800 (mínimo 30 min)
     * speed <= 10 m/s (para rechazar viajes en carro)
   - Al mintear, calcula reward con multiplicadores:
     * Base: 10 tokens por kg
     * Separado (no MIXED): x1.5
     * HAZARDOUS (reporte de peligro): x2
     * Official checkpoint: x2 adicional
   - Mintea tokens PRIMA al hiker al mismo tiempo
   - Guarda stats del hiker (hikerTotalKg, hikerHikeCount)
   - Emite evento HikeMinted

3. RewardRegistry.sol — Catálogo de recompensas canjeables:
   - Enum RewardCategory con 8 categorías: IMMEDIATE, EXPERIENCE, OUTDOOR, SUSTAINABILITY, DONATION, SERVICE, MERCH, EXCLUSIVE
   - Struct Reward con id, name, description, sponsor, costInPrima, category, stock, active, imageURI
   - Struct Redemption con rewardId, user, timestamp, voucherCode, claimed
   - addReward() solo por owner
   - redeemReward() quema tokens del usuario y genera voucher único con keccak256
   - claimVoucher() solo el sponsor puede marcarlo como canjeado
   - getRewardsByCategory() para el frontend

Usa @openzeppelin/contracts versión compatible con pragma ^0.8.20.
Instala con: forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

### Prompt 2.2: Script de deploy con seed
```
Escribe ./script/Deploy.s.sol que:

1. Deploya PrimaToken, RastroNFT, RewardRegistry (en ese orden porque dependen).
2. Llama prima.setMinter(rastroNFT) y prima.setBurner(rewardRegistry).
3. Apruebes el deployer como sponsor con registry.approveSponsor(deployer).
4. Seed de ~40 recompensas en las 8 categorías (revisa el archivo /frontend/data/rewards.ts para la lista exacta). Los IDs deben coincidir con el orden de ese archivo.
5. Al final, imprima las 3 direcciones con console.log para copiarlas.

Comando de deploy:
forge script script/Deploy.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --private-key $PRIVATE_KEY

Si falla, revisa que tengas MON en el faucet: https://faucet.monad.xyz
```

---

## HORA 3-4 — Frontend core

### Prompt 3.1: Integrar el hook de GPS
```
En el frontend del starter, crea src/hooks/useHikeTracker.ts con el contenido que está en /frontend/components/useHikeTracker.tsx.

Adapta los imports y el path según la estructura del starter.

Crea una página de prueba en /app/hike/page.tsx o /pages/hike.tsx (según si es app router o pages router) que:
1. Muestre un botón "Iniciar Hike"
2. Al tocarlo, pida permisos de geolocalización
3. Muestre en vivo: distancia, tiempo, velocidad, puntos capturados
4. Tenga botón "Detener" que para el tracking

Usa Tailwind CSS si el starter lo tiene. Si no, estilos inline o CSS modules.
```

### Prompt 3.2: Mapa con Leaflet
```
Instala react-leaflet y leaflet:
pnpm add react-leaflet leaflet
pnpm add -D @types/leaflet

Crea src/components/HikeMap.tsx que:
1. Reciba props: points (array de {lat, lng})
2. Renderice un mapa Leaflet con tiles de OpenStreetMap
3. Dibuje la ruta como Polyline con color verde brillante
4. Centre el mapa automáticamente en el último punto
5. Tenga marker en punto de inicio y punto actual

IMPORTANTE: Leaflet necesita el CSS, añade en el componente:
import "leaflet/dist/leaflet.css";

Para Next.js, usa dynamic import con ssr: false:
const HikeMap = dynamic(() => import("./HikeMap"), { ssr: false });
```

### Prompt 3.3: Componente Submit Hike
```
Integra el componente SubmitHike que está en /frontend/components/SubmitHike.tsx.

Conéctalo al flujo:
1. Después de detener el tracking, mostrar el SubmitHike
2. Al submit, llamar al contrato RastroNFT.mintRastro() con los datos
3. Usa viem o ethers para las llamadas al contrato

Para subir la foto a IPFS usa Pinata:
- Endpoint: https://api.pinata.cloud/pinning/pinFileToIPFS
- Necesitas JWT de Pinata (regístrate gratis en pinata.cloud)
- Mete el token en NEXT_PUBLIC_PINATA_JWT

El flujo completo:
1. Subir foto a IPFS → obtener CID
2. Armar metadata JSON con: { name, description, image: ipfsCID, attributes: [...stats] }
3. Subir metadata a IPFS → obtener metadataCID
4. Llamar mintRastro() con metadataCID como tokenURI
```

---

## HORA 5-6 — Wallet, conexión on-chain, mint

### Prompt 5.1: Integración Privy
```
El starter ya trae Privy configurado. Verifícalo y:

1. Crea proyecto en dashboard.privy.io, obtén APP_ID
2. Mete NEXT_PUBLIC_PRIVY_APP_ID en .env.local
3. Configura Privy para:
   - Login methods: email, Google, wallet
   - Embedded wallet: createOnLogin = "users-without-wallets"
   - Default chain: Monad Testnet

Configura Monad Testnet como chain custom:
{
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
    public: { http: ["https://testnet-rpc.monad.xyz"] }
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadexplorer.com" }
  }
}
```

### Prompt 5.2: Hooks para interactuar con contratos
```
Crea src/hooks/useRastros.ts que exponga:

- useMintHike(): mutation que llama RastroNFT.mintRastro()
- usePrimaBalance(address): query del balance de PRIMA
- useRedeemReward(rewardId): mutation que llama RewardRegistry.redeemReward()
- useUserNFTs(address): query para listar los NFTs del usuario
- useHikerStats(address): query de kg totales y hikes count

Usa viem con el wallet de Privy. El ABI de los contratos lo puedes sacar de ./out/*.json después de compilar con forge build.

Guarda las direcciones de los contratos en src/constants.ts:
export const CONTRACTS = {
  PRIMA_TOKEN: "0x...",
  RASTRO_NFT: "0x...",
  REWARD_REGISTRY: "0x..."
};
```

---

## HORA 7-8 — Catálogo de recompensas y galería

### Prompt 7.1: Integrar catálogo
```
Integra el componente RewardsCatalog que está en /frontend/components/RewardsCatalog.tsx.

Crea página /rewards que:
1. Obtenga primaBalance del hook usePrimaBalance
2. Pase todas las REWARDS importadas de /data/rewards.ts
3. Al canjear, llame a useRedeemReward()
4. Muestre toast/alert con el voucher code cuando termine

Necesitas que el usuario primero haga approve de sus PRIMA al RewardRegistry:
- Antes del primer redeem, llamar primaToken.approve(registry, MAX_UINT256)
```

### Prompt 7.2: Galería de NFTs del usuario
```
Crea /gallery que:

1. Consulta useUserNFTs(userAddress)
2. Para cada NFT, fetchea su metadata de IPFS
3. Renderiza grid con cards mostrando:
   - Imagen del NFT (la compuesta con ruta + stats)
   - Nombre (ej: "Rastro #042 - Primavera")
   - Stats: kg, km, min
   - Link al explorer: https://testnet.monadexplorer.com/token/{contract}/{tokenId}

Opcional si hay tiempo: modal al clickear con la metadata completa.
```

---

## HORA 9-10 — Pulido visual y diseño

### Prompt 9.1: Diseño general de la app
```
Aplica una identidad visual cohesiva a toda la app usando estos valores:

Colores:
- Verde encino (primary): #2A5C3E
- Tierra rojiza (accent): #B8572C
- Crema hueso (background): #F5F1E8
- Negro carbón (text): #1A1A1A
- Naranja atardecer: #FF6B35
- Gris neblina: #A8A8A0

Tipografía:
- Headings: "Fraunces" (serif con personalidad) o "Unbounded"
- Body: "Inter" o "DM Sans"
- Mono/stats: "JetBrains Mono"

Estilo:
- Bordes redondeados suaves (12-16px)
- Sombras sutiles con tono warm
- Iconos emoji grandes en headers
- Mucho whitespace
- Landing con mapa de fondo sutilizado

Evita:
- Purple gradients genéricos
- Inter como único font
- Estética "AI slop"

El nombre del proyecto es "Rastros". Tagline: "Tus huellas, tu impacto."
```

### Prompt 9.2: Landing hero
```
Crea una landing page /app/page.tsx con:

1. Hero section a pantalla completa con:
   - Título grande: "RASTROS"
   - Tagline: "Cada kilómetro. Cada kilo. Tu huella, on-chain."
   - Stats en vivo del contrato: total hikes, total kg, total hikers
   - Botón CTA: "Iniciar mi primer hike"
   - Fondo sutil con mapa topográfico o ilustración de cerros

2. Sección "Cómo funciona" con 4 pasos en cards:
   - Sube al cerro
   - Junta basura
   - Mintea tu NFT único
   - Canjea por chela, café, o dona

3. Sección "Recompensas" mostrando las 8 categorías como tarjetas

4. Footer minimalista con créditos al equipo y link al repo
```

---

## HORA 11-12 — Pitch, demo, polish final

### Prompt 11.1: Generar video de demo backup
```
Usa OBS o QuickTime para grabar un video de 60 segundos mostrando:
1. Landing (3s)
2. Login con Google (5s)
3. Iniciar hike, mostrar tracking en vivo (10s)
4. Detener hike, mostrar submit con foto + tipo de basura (15s)
5. Aparece el NFT minted (5s)
6. Galería con el NFT (5s)
7. Catálogo de recompensas (10s)
8. Canje de una chela (voucher generado) (7s)

Comprime con ffmpeg a <5MB:
ffmpeg -i demo.mov -vcodec libx264 -crf 28 demo.mp4

Súbelo a un lugar accesible (YouTube unlisted o Drive) por si el WiFi del venue falla.
```

### Prompt 11.2: README del repo
```
Genera un README.md completo con:
- Nombre del proyecto + tagline
- Problema que resuelve (datos: 919 incendios Jalisco 2025)
- Solución
- Demo video link
- Stack: Next.js, Privy, Foundry, Monad testnet, Pinata
- Contratos deployados (direcciones)
- Cómo correr localmente
- Estructura del repo
- Equipo
- Licencia MIT
```
