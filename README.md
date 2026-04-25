# Trepacerros

**Tus huellas, tu impacto.**

> Hackathon Monad Blitz Guadalajara 2026 -- Frutero Club x Monad

---

## El problema

Jalisco registro mas de 60 incendios forestales en la temporada seca 2025, muchos de origen humano. Los senderos del Area Metropolitana de Guadalajara (Bosque La Primavera, Cerro del Colli, Bosque Los Colomos, Bosque Metropolitano) acumulan basura que amplifica el riesgo: una botella de vidrio concentra luz solar, una colilla contamina 50 litros de agua.

No hay incentivos tangibles para limpiar. Los voluntarios no tienen forma de verificar su impacto ni recibir reconocimiento.

## La solucion

Trepacerros convierte cada hike de limpieza en impacto verificable on-chain:

1. **Trepa** -- Graba tu ruta GPS en tiempo real mientras recoges basura en senderos de GDL
2. **Verifica** -- Sube foto de la basura recolectada, clasifica por tipo (PET, vidrio, metal, organico, peligroso) y mintea un NFT unico con los datos de tu contribucion
3. **Gana** -- Recibe tokens $CERRO (ERC-20) proporcionales al peso y tipo de basura. Redimelos por recompensas locales: cervezas artesanales, cafe, gear de hiking, experiencias

## Demo: flow E2E

1. Entra a la app, conecta wallet via Privy (email/Google/wallet)
2. Dashboard con mapa, balance $CERRO y stats del hiker
3. Selecciona ruta en `/hike/select` (4 cerros con datos reales)
4. Inicia trepada: tracking GPS en vivo con mapa Leaflet
5. Termina trepada: ve distancia, duracion, elevacion
6. Abre Proof-of-Clean: sube foto, selecciona tipo de basura, estima peso
7. Metadata sube a IPFS (Pinata), NFT se mintea en Monad testnet
8. Tokens $CERRO se acreditan automaticamente
9. Redime en el Marketplace: cerveza, cafe, gear, donaciones
10. Perfil muestra balance, stats, actividad on-chain, vouchers
11. Wiki de Residuos: aprende sobre cada material y donde reciclarlo en GDL
12. Leaderboard: top hikers por kg total recolectado

## Stack tecnico

| Capa | Tecnologia |
|---|---|
| Blockchain | Monad Testnet (chain 10143) |
| Contratos | Solidity (Foundry) -- ERC-721 (NFT), ERC-20 (token), Registry |
| Frontend | Next.js 14 App Router, TypeScript |
| Styling | Tailwind CSS + Stitch (Google) design system |
| Fonts | Lexend, Space Grotesk, Material Symbols Outlined |
| Auth | Privy (email/Google/wallet) |
| Web3 | wagmi v2 + viem |
| IPFS | Pinata |
| Mapa | Leaflet + react-leaflet (SSR-safe) |
| GPS | Browser Geolocation API con Haversine |

## Contratos deployados (Monad Testnet)

| Contrato | Address | Funcion |
|---|---|---|
| PrimaToken (ERC-20) | [`0xd4Bf2c611f382Cd51ff484276CE6c008016de881`](https://testnet.monadexplorer.com/address/0xd4Bf2c611f382Cd51ff484276CE6c008016de881) | Token $CERRO (symbol: PRIMA) |
| RastroNFT (ERC-721) | [`0x6b4D0F9024479219af325D6Cca5aBa3AFec76952`](https://testnet.monadexplorer.com/address/0x6b4D0F9024479219af325D6Cca5aBa3AFec76952) | NFT de cada hike de limpieza |
| RewardRegistry | [`0x4327566658bA16a37d804e8738AD283170a53b27`](https://testnet.monadexplorer.com/address/0x4327566658bA16a37d804e8738AD283170a53b27) | Catalogo de 41 recompensas canjeables |

## Como correr local

```bash
git clone <repo-url>
cd monad-blitz-starter
pnpm install

# .env.local
NEXT_PUBLIC_PRIVY_APP_ID=<tu-privy-app-id>
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC056DA0254ba095b0BfDBe688910ff5905aBAe70
PINATA_JWT=<tu-pinata-jwt>
NEXT_PUBLIC_GATEWAY_URL=https://gateway.pinata.cloud/ipfs

pnpm dev
# Abre http://localhost:3000
```

Requiere Node 18+, pnpm.

## Rutas de la app

| Ruta | Descripcion |
|---|---|
| `/` | Landing (no auth) / Dashboard (auth) |
| `/hike` | Tracking GPS + Proof-of-Clean + mint |
| `/hike/select` | Seleccion de ruta (4 cerros GDL) |
| `/rewards` | Marketplace de recompensas |
| `/profile` | Perfil, balance, actividad on-chain |
| `/profile/leaderboard` | Top hikers por kg recolectado |
| `/wiki` | Wiki de residuos + guia de reciclaje |
| `/gallery` | Galeria de NFTs minteados |
| `/blitz-demo` | Demo original del Blitz starter (legacy) |

## Equipo

Proyecto individual -- Hackathon Monad Blitz GDL 2026

Construido con Claude Code (Anthropic) como copiloto de desarrollo.

## Licencia

MIT
