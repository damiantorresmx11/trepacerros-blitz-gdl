# 🟣 Monad Blitz Starter

> Full Stack template para construir en Monad — ERC1155 + Next.js + Privy

## 🎯 Contrato de Ejemplo

Este contrato ya está deployado para que veas cómo funciona:

📍 **`0xC056DA0254ba095b0BfDBe688910ff5905aBAe70`** (Ejemplo)

[Ver en Explorer](https://monad-testnet.socialscan.io/address/0xC056DA0254ba095b0BfDBe688910ff5905aBAe70)

> ⚠️ **Para el hackathon:** Debes deployar TU PROPIO contrato. Este es solo una referencia.

---

## 🛤️ Elige tu Camino

### 🟢 Soy nuevo + Uso agente IA
> "Mi agente me ayuda con todo"

1. Dale a tu agente los [skills de abajo](#-skills-para-agentes-ia-opcional)
2. Pídele: "Ayúdame a deployar un contrato ERC1155 en Monad testnet"
3. El agente te guía paso a paso

### 🟡 Soy nuevo + Sin agente
> "Quiero la opción más fácil"

1. Usa **[Remix](https://docs.monad.xyz/guides/deploy-smart-contract/remix)** (en el browser, no instalas nada)
2. Copia el contrato de `contracts/src/BlitzCollection.sol`
3. Sigue la guía de Monad

### 🔵 Ya sé programar
> "Dame las herramientas"

1. Usa **[Foundry](https://docs.monad.xyz/guides/deploy-smart-contract/foundry)** o **[Hardhat](https://docs.monad.xyz/guides/deploy-smart-contract/hardhat)**
2. Clona este repo y modifica el contrato
3. Deploya con el script incluido

### 🟣 Soy pro
> "Solo necesito los RPCs"

```
Testnet RPC: https://testnet-rpc.monad.xyz
Mainnet RPC: https://rpc.monad.xyz
Chain ID Testnet: 10143
Chain ID Mainnet: 143
Faucet: https://faucet.monad.xyz
Explorer: https://monad-testnet.socialscan.io
```

## ⚡ Quick Start

### Opción A: Probar el ejemplo (5 min)

```bash
git clone https://github.com/fruterito101/monad-blitz-starter.git
cd monad-blitz-starter/frontend
npm install
cp .env.example .env.local
# Crear cuenta en dashboard.privy.io y pegar App ID
npm run dev
```

### Opción B: Deployar tu propio contrato (15 min)

```bash
git clone https://github.com/fruterito101/monad-blitz-starter.git
cd monad-blitz-starter/contracts

# Instalar dependencias
forge install

# Fondear wallet desde https://faucet.monad.xyz

# Deploy
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key TU_PRIVATE_KEY \
  --broadcast

# Copiar la dirección de TU contrato a frontend/.env.local
```

### Opción C: Pedir ayuda a un agente IA

> "Clona este repo y ayúdame a deployar mi propio contrato ERC1155 en Monad"
> 
> https://github.com/fruterito101/monad-blitz-starter

## 📝 Crear tu cuenta de Privy

1. Ve a https://dashboard.privy.io
2. Crea una cuenta (gratis)
3. Crea una nueva App
4. Copia el **App ID** 
5. Pégalo en tu `.env.local`

## 🔧 Si quieres deployar tu propio contrato

```bash
# Setup contratos
cd contracts
cp .env.example .env
# Editar .env con tu private key
forge install
forge build

# Deploy a Monad Testnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://testnet-rpc.monad.xyz \
  --broadcast

# Actualiza la dirección en frontend/.env.local
```

## 🤖 Skills para Agentes IA (Opcional)

> Si usas un agente de IA para programar (Claude, Cursor, OpenClaw, etc.), estas skills le ayudan a entender mejor Monad.

### Skills recomendadas (Moltiverse):

| Skill | Descripción | Link |
|-------|-------------|------|
| **nad.fun** | Crear y tradear tokens en nad.fun | [clawhub.ai/portdeveloper/nadfun](https://www.clawhub.ai/portdeveloper/nadfun) |
| **nad.fun token creation** | Flujo detallado de creación de tokens | [clawhub.ai/therealharpaljadeja/nadfun-token-creation](https://www.clawhub.ai/therealharpaljadeja/nadfun-token-creation) |
| **monad-development** | Wallets, contratos, verificación | [gist.github.com/moltilad/...](https://gist.github.com/moltilad/31707d0fc206b960f4cbb13ea11954c2) |

### Documentación para Agentes:

| Recurso | URL |
|---------|-----|
| Nad.fun Skill | https://nad.fun/skill.md |
| Nad.fun Token Creation | https://nad.fun/create.md |
| Nad.fun Trading | https://nad.fun/trading.md |
| Monad Docs | https://docs.monad.xyz |
| Monad LLMs.txt | https://docs.monad.xyz/llms.txt |

### APIs útiles:

```bash
# Faucet (fondear wallet testnet)
POST https://agents.devnads.com/v1/faucet
{"chainId": 10143, "address": "0x..."}

# Verificación de contratos
POST https://agents.devnads.com/v1/verify
```

### RPCs:

| Network | RPC |
|---------|-----|
| Testnet | https://testnet-rpc.monad.xyz |
| Mainnet | https://rpc.monad.xyz |

### 📥 Links directos para tu agente:

Copia estos links y dáselos a tu agente para que los descargue:

```
https://nad.fun/llms.txt
https://raw.githubusercontent.com/portdeveloper/skills/refs/heads/master/skills/monad-development/SKILL.md
```

### Ejemplo de uso:

Dale este mensaje a tu agente:

> "Instálate estas skills y crea un token en nad.fun para mi app. 
> Ya que esté tu wallet me la pasas para mandarte $MON"
> 
> - https://nad.fun/llms.txt
> - https://raw.githubusercontent.com/portdeveloper/skills/refs/heads/master/skills/monad-development/SKILL.md

### 🔗 Recurso principal:

**[Moltiverse Resources (Notion)](https://monad-foundation.notion.site/Moltiverse-resources-2fb6367594f280c3820adf679d9b35ff)** — Todas las skills, docs y recursos en un solo lugar.

> **Nota:** Esto es opcional. Si no usas agentes IA, puedes ignorar esta sección.

## 📦 Qué incluye

### Contratos (`/contracts`)
- **BlitzCollection.sol** — ERC1155 con mint público
- Configurado para Monad (evm_version: prague)
- Deploy script listo
- Verificación incluida

### Frontend (`/frontend`)
- **Next.js 14** con App Router
- **Privy** para auth (Google, Email, Wallet)
- **wagmi + viem** para interacción con contrato
- Componentes listos para usar

## 🔧 Configuración

### Contratos

1. Obtén testnet MON del [faucet](https://faucet.monad.xyz)
2. Copia tu private key a `.env`
3. Deploya con `forge script`

### Frontend

1. Crea una app en [Privy Dashboard](https://dashboard.privy.io)
2. Copia el App ID a `.env.local`
3. Agrega la dirección del contrato deployado
4. `npm run dev`

## 🌐 Networks

| Network | Chain ID | RPC |
|---------|----------|-----|
| Testnet | 10143 | https://testnet-rpc.monad.xyz |
| Mainnet | 143 | https://rpc.monad.xyz |

## 📚 Recursos

- [Monad Docs](https://docs.monad.xyz)
- [Privy Docs](https://docs.privy.io)
- [Foundry Book](https://book.getfoundry.sh)

## 🆘 Troubleshooting

Ver [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para errores comunes.

---

Made with 🍓 by [Frutero](https://frutero.club) para Monad Blitz CDMX
