# Rastros

> Tus huellas, tu impacto.

Cada hike de limpieza en los cerros de Jalisco se convierte en un NFT único on-chain. Juntas basura, ganas tokens PRIMA, canjeas por chela, café, eventos, equipo outdoor o donas a ONGs ambientales.

**Monad Blitz Guadalajara 2026 — Frutero Club × Monad**

## El problema

En 2025, Jalisco tuvo **919 incendios forestales** con **88,821 hectáreas dañadas**, siendo la entidad #1 del país. El Bosque La Primavera, pulmón de Guadalajara, sufre ~49 incendios por temporada.

Mientras tanto, miles de hikers suben cada fin de semana a La Primavera, Colli, Colomos, sin razón real para bajar con la basura que otros dejaron.

## La solución

**Rastros** convierte cada hike en impacto verificable:

1. **Activas GPS tracking** al iniciar tu ruta
2. **Juntas basura** en el camino
3. **Subes foto + tipo de basura + peso** al bajar
4. **Se mintea tu NFT único** con tu ruta dibujada y todos los stats
5. **Ganas tokens PRIMA** según kilos y separación
6. **Canjeas** en 40+ recompensas distribuidas en 8 categorías

## Stack

- **Frontend:** Next.js 14, Tailwind, Privy (wallet embebida)
- **Smart Contracts:** Solidity 0.8.20, OpenZeppelin, Foundry
- **Chain:** Monad Testnet (Chain ID 10143)
- **Storage:** IPFS via Pinata
- **Mapas:** Leaflet + OpenStreetMap
- **GPS:** Geolocation API nativa con persistencia offline

## Contratos (Monad Testnet)

| Contrato | Dirección |
|---|---|
| PrimaToken | `0x...` (llenar post-deploy) |
| RastroNFT | `0x...` |
| RewardRegistry | `0x...` |

Explorer: https://testnet.monadexplorer.com

## Anti-fraude on-chain

Validaciones en `RastroNFT.mintRastro()`:

- Distancia mínima: 1 km
- Duración mínima: 30 min
- Velocidad máx: 10 m/s (rechaza viajes en carro)
- Reto diario en foto (cambia cada día, evita reusar fotos)
- Multiplicadores por separación correcta (+1.5x) y checkpoint oficial (+2x)

## Las 8 categorías de recompensa

1. 🍺 **Consumo inmediato** — chela, café, smoothies, tacos
2. 🎯 **Eventos** — trail runs, talleres, hikes guiados
3. 🎒 **Outdoor** — equipo deportivo, reparaciones
4. 🌱 **Sustentabilidad** — productos eco para tu hogar
5. 💚 **Donación** — aporte directo a ONGs ambientales
6. 🏪 **Servicios** — restaurantes, lavanderías, libros
7. 👕 **Merch** — identidad del proyecto
8. ⭐ **Exclusivo** — rutas VIP, early access, eventos privados

## Cómo correr localmente

```bash
# Clonar
git clone https://github.com/[equipo]/rastros
cd rastros

# Dependencias
pnpm install

# Variables de entorno
cp .env.example .env.local
# Completar: NEXT_PUBLIC_PRIVY_APP_ID, NEXT_PUBLIC_PINATA_JWT, PRIVATE_KEY

# Compilar contratos
forge build

# Deploy a Monad testnet (necesitas MON del faucet)
forge script script/Deploy.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --private-key $PRIVATE_KEY

# Frontend
pnpm dev
```

Faucet de MON: https://faucet.monad.xyz

## Estructura

```
rastros/
├── contracts/
│   ├── PrimaToken.sol       # ERC20 de recompensas
│   ├── RastroNFT.sol        # ERC721 por hike + mint de tokens
│   └── RewardRegistry.sol   # Catálogo canjeable
├── script/
│   └── Deploy.s.sol         # Deploy + seed de 40+ recompensas
├── frontend/
│   ├── app/                 # Next.js app router
│   ├── components/          # UI components
│   ├── hooks/
│   │   └── useHikeTracker.ts  # GPS tracking con persistencia offline
│   └── data/
│       ├── trashTypes.ts    # Base de datos científica de residuos
│       └── rewards.ts       # Catálogo de 40+ recompensas
└── README.md
```

## Cómo usa Monad

El caso de uso exige transacciones baratas y rápidas a escala:

- Cada hike = mint NFT + mint tokens + updates de stats (3 txs)
- Cada canje = burn tokens + mint voucher (2 txs)
- Validación comunitaria = microtransacciones de votos

Con 500 hikers activos en un fin de semana en La Primavera = 5,000+ transacciones. Monad parallel EVM es la única chain EVM que hace esto económicamente viable.

## Equipo

- **Damian Torres** — Full-stack engineering
- **[Artista 2D]** — Identidad visual, UI/UX, pitch deck
- **[Experto en biomateriales]** — Contenido educativo, ciencia de residuos

## Próximos pasos

- Piloto con Bosque La Primavera A.C. y 2-3 cervecerías artesanales
- Expansión a Tapalpa, Mazamitla, Nevado de Colima
- Integración con centros de acopio certificados (Ecolana)
- Dashboard público de contaminación por zona para investigación
- NFTs con árbol 3D generativo (colaboración con modelador)

## Licencia

MIT

---

Hecho en el Monad Blitz Guadalajara, 24-25 abril 2026.
Gracias Frutero Club × Monad × la banda outdoor de GDL 🥑
