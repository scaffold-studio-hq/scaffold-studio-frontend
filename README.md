<div align="center">

![Stellar Studio Banner](https://raw.githubusercontent.com/Scaffold-Studio/stellar-studio-brand-assets/main/scaffold-studio-banner.png)

# Stellar Studio Frontend

**Deploy and command Stellar tokens, NFTs, and DAOs through conversation.**

AI copilots that let builders launch, operate, and transact on Stellar with natural language.

**Live at [scaffold-studio.app](https://scaffold-studio.app)**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6)](https://www.typescriptlang.org/)

[Live Demo](https://scaffold-studio.app) • [Quick Start](#quick-start) • [Features](#features) • [Architecture](#architecture) • [AI Tools](#ai-tools)

</div>

---

## Overview

**52 operations. 8 contract types. 1 conversation.**

Stellar Studio Frontend is a Next.js application that makes Stellar blockchain operations accessible through natural language. Built with React 19 and the Vercel AI SDK, it provides a chat interface for deploying tokens, NFTs, and governance contracts without writing code.

**What You Can Do:**
- Deploy 5 token types through conversation
- Launch 2 NFT collection types and mint on demand
- Spin up MerkleVoting governance with auto-generated merkle roots
- Query and orchestrate every deployed contract from the factories
- Execute token and NFT operations (transfer, mint, burn, approve)
- Manage governance voting with proof-backed workflows

**How It Works:**
- Chat with AI in natural language
- AI selects appropriate blockchain tools
- Review and sign transactions in Freighter wallet
- Track deployment status in real-time
- View all contracts in Stellar Expert

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [AI Tools](#ai-tools)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Wallet Integration](#wallet-integration)
- [Project Structure](#project-structure)

---

## Features

### Conversational Contract Deployment

Deploy smart contracts using natural language:

```
User: "Deploy a pausable token called MyToken with symbol MTK and 1 million supply"

AI: Preparing pausable token deployment...
    Name: MyToken
    Symbol: MTK
    Supply: 1,000,000
    [Sign Transaction Button]

User: [Signs in Freighter wallet]

AI: Token deployed successfully!
    Contract: CBDBMJRY5FG5GKTTVIU4K2PIVAYUUUSULQCDTEL2CXLJNTJBUMLJVXYV
    [View in Explorer]
```

### Auto-Merkle-Root Generation

Deploy governance without manual merkle tree generation:

```
User: "Deploy governance for these 3 voters:
      - GBRPY...
      - GBZXN...
      - GDQP2..."

AI: [Automatically generates merkle root from addresses]
    Merkle Root: 3ab7c0c83439fa35e484da41bfc4fbf5a6543d9b95dea3155978e5abfd9db4f8
    Eligible Voters: 3
    [Sign Transaction Button]
```

### Factory Query System

Real-time blockchain data queries:

- List all deployed tokens, NFTs, governance contracts
- Filter by type (Pausable, Capped, Enumerable, etc.)
- Filter by admin/owner address
- View deployment timestamps
- Copy addresses with one click
- Open in Stellar Expert explorer

### Transaction Management

**Pre-Transaction:**
- Parameter validation
- Transaction simulation
- Fee estimation
- Clear confirmation dialog

**Post-Transaction:**
- Real-time status polling
- Success animations
- Explorer links
- Contract address display

---

## Architecture

### System Overview

![Frontend Architecture](https://raw.githubusercontent.com/Scaffold-Studio/stellar-studio-brand-assets/main/Frontend%20Architecture.png)

```mermaid
graph TB
    subgraph "Frontend Application"
        UI[Next.js 15 App<br/>React 19 UI]
        Chat[AI Chat Interface<br/>52 Tools]
        Wallet[Freighter Integration<br/>Transaction Signing]
        DB[PostgreSQL<br/>Chat History]
    end
    
    subgraph "AI Layer"
        SDK[Vercel AI SDK<br/>Tool Calling]
        Tools[AI Tools<br/>Deployment + Query]
        Utils[Utilities<br/>Merkle + Validation]
    end
    
    subgraph "Stellar Integration"
        Client[Stellar SDK<br/>Transaction Builder]
        RPC[Stellar RPC<br/>Query + Submit]
    end
    
    subgraph "Stellar Network"
        TF[Token Factory]
        NF[NFT Factory]
        GF[Governance Factory]
        Contracts[Deployed Contracts]
    end
    
    UI --> Chat
    Chat --> SDK
    SDK --> Tools
    Tools --> Utils
    Tools --> Client
    Chat --> Wallet
    Wallet --> Client
    Client --> RPC
    RPC --> TF & NF & GF
    TF & NF & GF --> Contracts
    UI --> DB
    
    style UI fill:#7D00FF,color:#fff
    style SDK fill:#4CAF50,color:#fff
    style Client fill:#2196F3,color:#fff
```

### Data Flow

![Frontend Data Flow](https://raw.githubusercontent.com/Scaffold-Studio/stellar-studio-brand-assets/main/Frontend%20Data%20Flow.png)

```mermaid
sequenceDiagram
    participant User
    participant Chat as Chat UI
    participant AI as AI SDK
    participant Tools
    participant Wallet as Freighter
    participant Stellar
    
    User->>Chat: "Deploy capped token"
    Chat->>AI: Process message
    AI->>Tools: deployToken tool
    Tools->>Tools: Build config
    Tools->>Tools: Generate salt
    Tools-->>AI: Transaction intent
    AI-->>Chat: Stream response
    Chat->>User: Review transaction
    User->>Wallet: Approve & sign
    Wallet->>Stellar: Submit signed TX
    Stellar-->>Wallet: TX hash
    Wallet-->>Chat: Success
    Chat->>User: Contract address
```

### Component Architecture

![Frontend Component Architecture](https://raw.githubusercontent.com/Scaffold-Studio/stellar-studio-brand-assets/main/Frontend%20Component%20Architecture.png)

```mermaid
graph LR
    subgraph "Pages"
        Home[Landing Page]
        ChatPage[Chat Interface]
        About[About Page]
    end
    
    subgraph "Chat Components"
        Messages[Message List]
        Input[Chat Input]
        Suggested[Suggested Actions<br/>36 Quick Actions]
    end
    
    subgraph "Tool UI"
        Forms[Action Forms]
        Results[Query Results]
        Status[TX Status]
    end
    
    subgraph "Wallet UI"
        Connect[Connect Button]
        Info[Wallet Info]
        Network[Network Selector]
    end
    
    ChatPage --> Messages & Input & Suggested
    Messages --> Forms & Results & Status
    ChatPage --> Connect & Info & Network
    
    style ChatPage fill:#7D00FF,color:#fff
```

---

## AI Tools

### Tool Categories (52 Total)

**Deployment Tools (3):**
- deployToken - Deploy fungible tokens
- deployNFT - Deploy NFT collections
- deployGovernance - Deploy MerkleVoting governance

**Factory Queries (12):**
- Token factory queries (4)
- NFT factory queries (4)
- Governance factory queries (4)

**Token Operations (15):**
- Query operations (7) - balance, supply, allowance, etc.
- Transaction operations (8) - transfer, mint, burn, approve, pause

**NFT Operations (17):**
- Query operations (10) - owner, balance, metadata, etc.
- Transaction operations (7) - mint, transfer, burn, approve

**Governance Operations (3):**
- vote - Cast vote with merkle proof
- has_voted - Check voter status
- get_vote_results - View vote tallies

**Utilities (2):**
- getBalance - Check XLM balance
- getContractInfo - Get factory addresses

### Example Tool Usage

<details>
<summary><b>Deploy Token Example</b></summary>

**User Input:**
```
"Deploy a pausable token called Stellar Coin with symbol STC, 
 7 decimals, and 1 million initial supply"
```

**AI Tool Execution:**
```typescript
deployToken({
  name: "Stellar Coin",
  symbol: "STC",
  decimals: 7,
  initialSupply: "1000000",
  tokenType: "Pausable",
  admin: "[user wallet]",
  manager: "[user wallet]"
})
```

**Result:**
```
Token deployed at: CBDBMJRY5FG5GKTTVIU4K2PIVAYUUUSULQCDTEL2CXLJNTJBUMLJVXYV
View in explorer: [link]
```

</details>

<details>
<summary><b>Deploy Governance Example</b></summary>

**User Input:**
```
"Create governance for these voters:
 GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H
 GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI
 GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37"
```

**AI Tool Execution:**
```typescript
// Auto-generates merkle root!
deployGovernance({
  governanceType: "MerkleVoting",
  admin: "[user wallet]",
  voterAddresses: [
    "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H",
    "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
    "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37"
  ]
})
// Merkle root: 3ab7c0c83439fa35e484da41bfc4fbf5a6543d9b95dea3155978e5abfd9db4f8
```

**Result:**
```
Governance deployed at: CBPO5GUS65P56TPH2UOWHIUHP46HX2YXOOQSDGB52UJOJU5EAMBIUQQZ
Eligible voters: 3
Merkle root: 3ab7c0c8...
```

</details>

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm package manager
- PostgreSQL database
- Freighter wallet extension
- OpenAI or xAI API key

### Installation

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Initialize database
pnpm db:migrate

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### First Deployment

1. **Connect Wallet** - Click "Connect Wallet" in header
2. **Select Network** - Choose testnet for testing
3. **Start Chat** - Type deployment command
4. **Review Transaction** - Check parameters
5. **Sign in Freighter** - Approve transaction
6. **View Result** - Get contract address

---

## Environment Setup

<details>
<summary><b>Complete Environment Configuration</b></summary>

```bash
# AI Provider (required)
OPENAI_API_KEY=sk-...
# OR
XAI_API_KEY=xai-...

# Database (required)
DATABASE_URL=postgresql://user:password@localhost:5432/stellar_studio

# Stellar Network (required)
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015

# Factory Addresses - Testnet (required)
NEXT_PUBLIC_TOKEN_FACTORY=CAHLJEQUCNTV7JPAPCMLCBIHOX7FFB57DUARJ6XGTW27FPCVKKY7JM2A
NEXT_PUBLIC_NFT_FACTORY=CDJQAGTVOK37NPBWMADBJDGFYM6BEAFV4T45S23D4LQLGSTMRRZ5RQ6X
NEXT_PUBLIC_GOVERNANCE_FACTORY=CC3SLHSCJHP7YJ462ZIACJ54VOHL5ZFUODZKBTITIZSO74D4YOPR5WCE
```

</details>

---

## Development

### Commands

```bash
# Development
pnpm dev                # Start dev server
pnpm build              # Production build
pnpm start              # Start production server

# Database
pnpm db:generate        # Generate migrations
pnpm db:migrate         # Run migrations
pnpm db:push            # Push schema changes
pnpm db:studio          # Open Drizzle Studio

# Code Quality & E2E Testing
pnpm type-check         # TypeScript checking
pnpm lint               # Run linters
pnpm format             # Format code
pnpm test               # Run Playwright E2E tests (uses DATABASE_URL, AUTH_SECRET, OPENAI_API_KEY from .env.local)
```

### Database Schema

**Messages Table:**
```typescript
{
  id: number;
  chatId: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolName: string;
  toolResult: JSON;
  createdAt: timestamp;
}
```

**Deployments Table:**
```typescript
{
  id: number;
  contractAddress: string;
  contractType: 'token' | 'nft' | 'governance';
  deployerAddress: string;
  network: string;
  transactionHash: string;
  metadata: JSON;
  createdAt: timestamp;
}
```

---

## Wallet Integration

### Freighter Wallet

The application integrates with Freighter wallet for Stellar transaction signing.

**Connection Flow:**
1. User clicks "Connect Wallet"
2. App checks `window.freighterApi.isConnected()`
3. Request access if not connected
4. Retrieve public key
5. Store in React context
6. Display in header

**Transaction Signing:**
```typescript
import { signTransaction } from '@stellar/freighter-api';

// Build transaction
const tx = buildTransaction(params);

// Sign with Freighter
const signedXdr = await signTransaction(tx.toXDR(), {
  networkPassphrase: networkConfig.passphrase
});

// Submit to network
const result = await submitTransaction(signedXdr);
```

**Network Switching:**
- Automatic network detection from Freighter
- Validates network matches app configuration
- Warns user if mismatch detected

---

## Project Structure

```
stellar-studio-frontend/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing page
│   ├── chat/
│   │   └── [[...id]]/page.tsx  # Chat interface
│   ├── about/page.tsx          # About page
│   └── api/
│       └── chat/route.ts       # AI chat endpoint
│
├── components/                 # React components
│   ├── suggested-actions.tsx   # 36 quick actions
│   ├── chat-header.tsx         # Chat header with wallet
│   ├── console.tsx             # Message display
│   ├── multimodal-input.tsx    # Chat input
│   └── ui/                     # shadcn/ui components
│
├── lib/                        # Core libraries
│   ├── ai/
│   │   ├── tools/              # 52 AI tools
│   │   │   ├── token/          # Token tools
│   │   │   ├── nft/            # NFT tools
│   │   │   ├── governance/     # Governance tools
│   │   │   └── utils/          # Utility tools
│   │   ├── prompts.ts          # AI system prompts
│   │   └── models.ts           # AI model configs
│   │
│   ├── stellar/
│   │   ├── client.ts           # Stellar client wrapper
│   │   ├── config.ts           # Network configuration
│   │   └── wallet-kit.ts       # Freighter integration
│   │
│   ├── utils/                  # Shared utilities
│   │   ├── merkle.ts           # Merkle tree generation
│   │   ├── validation.ts       # Parameter validation
│   │   ├── salt.ts             # Salt generation
│   │   └── index.ts            # Amount formatting
│   │
│   └── db/
│       ├── schema.ts           # Drizzle schema
│       └── index.ts            # Database client
│
├── hooks/                      # React hooks
│   ├── useStellarWallet.ts
│   └── useWalletAPI.ts
│
└── providers/
    └── StellarWalletProvider.tsx
```

---

## AI Tools

### Supported Contract Operations

<details>
<summary><b>Token Deployments (5 types)</b></summary>

**Available Types:**
- Pausable - Emergency pause/unpause
- Capped - Maximum supply cap
- Allowlist - Whitelist-only holders
- Blocklist - Blacklist prohibited addresses  
- Vault - Time-locked custody

**Parameters:**
- Name, symbol, decimals
- Initial supply
- Admin and manager addresses
- Type-specific params (cap, asset, etc.)

</details>

<details>
<summary><b>NFT Deployments (2 types)</b></summary>

**Available Types:**
- Enumerable - Token enumeration and pagination
- AccessControl - Role-based permissions

**Parameters:**
- Collection name and symbol
- Owner address
- Admin address (for AccessControl)

**Note:** Royalties type exists in contracts but not exposed in frontend tools.

</details>

<details>
<summary><b>Governance Deployment (1 type)</b></summary>

**Type:**
- MerkleVoting - Proof-based voting

**Features:**
- Auto-generates merkle roots from voter addresses
- Supports weighted voting
- On-chain vote tallying

**Parameters:**
- Admin address
- Voter addresses array (AI auto-generates merkle root!)

</details>

<details>
<summary><b>Query Operations (12 factory queries)</b></summary>

**Token Factory:**
- List all deployed tokens
- Filter by type or admin
- Get deployment count

**NFT Factory:**
- List all NFT collections
- Filter by type or owner
- Get deployment count

**Governance Factory:**
- List all governance contracts
- Filter by type or admin
- Get deployment count

</details>

<details>
<summary><b>Contract Operations (32 operations)</b></summary>

**Token Operations (15):**
- Queries: name, symbol, balance, supply, decimals, allowance, paused
- Transactions: transfer, approve, mint, burn, pause/unpause

**NFT Operations (17):**
- Queries: name, symbol, balance, owner, approved, URI, total supply
- Transactions: mint, transfer, approve, burn

</details>

---

## Quick Start

### 1. Install Freighter Wallet

Visit [freighter.app](https://www.freighter.app/) and add the extension to your browser.

### 2. Fund Testnet Account

```bash
# Get your address from Freighter
# Visit Stellar Laboratory: https://laboratory.stellar.org/#account-creator
# Or use Friendbot API
```

### 3. Configure Application

```bash
cp .env.example .env.local
# Add your OpenAI API key
# Add your database URL
# Set Stellar network to testnet
```

### 4. Start Application

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

### 5. Deploy Your First Contract

1. Connect wallet in app header
2. Type: "Deploy a pausable token"
3. AI will ask for details (name, symbol, supply)
4. Review transaction
5. Sign in Freighter
6. View contract address in response

---

## Deployment

<details>
<summary><b>Deploy to Vercel</b></summary>

**Prerequisites:**
- GitHub repository
- Vercel account
- PostgreSQL database (Vercel Postgres or Neon)

**Steps:**

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Select `stellar-studio-frontend` as root directory

3. **Configure Environment Variables**
   - Add all variables from `.env.local`
   - Ensure all `NEXT_PUBLIC_` variables are set

4. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Visit deployment URL

5. **Setup Database**
   - Use Vercel Postgres or connect to Neon
   - Run migrations: `pnpm db:migrate`

</details>

---

## Technology Stack

**Framework:**
- Next.js 15 (App Router, Server Components, Server Actions)
- React 19 (Concurrent features, automatic batching)
- TypeScript 5.6 (Strict mode, full type safety)

**AI Integration:**
- Vercel AI SDK 5.0 (Streaming, tool calling)
- OpenAI / xAI (Language models)
- Custom tool system (52 blockchain tools)

**Blockchain:**
- Stellar SDK 14.2 (Transaction building, RPC queries)
- Freighter API (Wallet connection, transaction signing)
- Custom Stellar client (Factory interaction)

**Database:**
- PostgreSQL (Message persistence)
- Drizzle ORM (Type-safe queries)
- Vercel Postgres (Production hosting)

**UI:**
- Tailwind CSS 3.4 (Utility-first styling)
- shadcn/ui (Component library)
- Framer Motion (Animations)

---

## Security

### Wallet Security

- Client-side wallet integration only
- No private key storage on servers
- Freighter handles all signing
- Network isolation enforced

### Transaction Security

- User confirmation required for all write operations
- Clear transaction details before signing
- Fee estimation displayed
- Transaction status tracking

### Application Security

- Environment variables for sensitive data
- Input validation and sanitization
- SQL injection prevention (Drizzle ORM)
- XSS protection (React built-in)

---

## Additional Resources

**Documentation:**
- [CLAUDE.md](./CLAUDE.md) - AI prompts and instructions
- [Main README](../README.md) - Stellar Studio ecosystem

**Related Repositories:**
- [Stellar Studio Contracts](../stellar-studio-contracts/) - Smart contracts
- [Stellar Studio MCP Server](../stellar-studio-mcp-server/) - MCP backend

**External Links:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)
- [Freighter Wallet](https://www.freighter.app/)

---

## Contributing

Contributions welcome! Guidelines:

1. Fork repository
2. Create feature branch
3. Follow TypeScript best practices
4. Add tests for new features
5. Update documentation
6. Submit Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Part of the Stellar Studio Ecosystem**

[Live Demo](https://scaffold-studio.app) • [Contracts](../stellar-studio-contracts/) • [Frontend](.) • [MCP Server](../stellar-studio-mcp-server/)

Built with Next.js and AI for Stellar

Visit us at [scaffold-studio.app](https://scaffold-studio.app)

</div>
