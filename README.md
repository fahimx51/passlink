# PassLink ⚡

> **High-performance, zero-friction ephemeral text sharing, cloud-backed file hosting, and real-time end-to-end encrypted peer-to-peer file transfers.**

PassLink is a modern, privacy-first web application designed for secure, fast, and seamless data exchange. Whether you need to share confidential code snippets with self-destruct timers, distribute password-locked temporary file bundles, or transfer large files directly between browsers on a local or remote network with zero server storage, PassLink provides an all-in-one, streamlined solution.

---

## 🌐 Live Deployments

The PassLink ecosystem is deployed across a high-availability multi-cloud architecture:

| Component | Role | Live URL |
| :--- | :--- | :--- |
| **Frontend Client** | Next.js 16 App Router UI (Edge optimized) | [https://passlink-01.vercel.app/](https://passlink-01.vercel.app/) |
| **API Backend** | Express REST API (Serverless functions) | [https://passlink-pied.vercel.app/](https://passlink-pied.vercel.app/) |
| **WebSockets & Workers** | Socket.io Signaling & BullMQ Background Processing | [https://passlink-dgf1.onrender.com/](https://passlink-dgf1.onrender.com/) |

---

## ✨ Core Features

### 1. 🚀 Direct WebRTC Peer-to-Peer (P2P) File Transfer
- **Socket.io Signaling:** Instant 1-to-1 session rooms identified by 6-character room codes with a strict 2-client capacity per room.
- **Direct Browser-to-Browser Data Streams:** Files travel directly between client machines over WebRTC `RTCDataChannel`, completely bypassing intermediate storage servers.
- **Zero Server Footprint:** The backend never receives, processes, or retains transfer payload data.
- **High-Speed LAN Transfers:** When peers share a local area network, WebSockets and STUN negotiate direct local IP connections, achieving full local network transfer throughput.
- **Chunked Streaming with Flow Control:** Reads and streams files in 16 KB chunks with built-in backpressure handling to avoid browser memory saturation.
- **Transfer Control Handshake:** Interactive offer/accept/reject lifecycle prompts before sending bytes.

### 2. 📝 Ephemeral Code & Text Sharing (Pastebin)
- **Syntax Highlighting:** Live syntax highlighting supporting JavaScript, TypeScript, Python, HTML/CSS, JSON, Go, Rust, and more.
- **Granular Security:** Optional password protection hashed using industry-standard **Bcrypt**.
- **Automatic Self-Destruction:** Configurable Time-To-Live (TTL: 1–15 days) and maximum view limits (burn after *N* views).
- **Custom Vanity URLs:** Support for custom alphanumeric URL slugs.

### 3. 📦 Cloud-Backed Temporary File Storage
- **Direct Binary Uploads:** Client-to-cloud signed uploads directly to Cloudinary, keeping heavy file buffers off the API server.
- **Archive Support:** Multi-file packaging into `.zip` archives directly in the browser via JSZip.
- **Access Controls:** Protect file links with passwords, set download quotas, and define custom expiration dates.
- **Automated Queue Cleanup:** Background BullMQ workers automatically delete expired assets from storage and the database.

### 4. 🎨 Modern, Responsive Experience
- **Fluid Design:** Crafted with Tailwind CSS v4 and DaisyUI v5 with glassmorphism effects and animated feedback.
- **Dark & Light Mode:** System-aware theme toggle with persistent user preference storage.
- **Mobile-First Responsive Layout:** Full functionality across smartphones, tablets, and desktop workstations.

---

## 🛠️ Tech Stack Breakdown

PassLink is organized as a decoupled monorepo featuring a Next.js frontend and an Express/TypeScript backend:

```
passlink/
├── client/          # Next.js frontend web application
└── server/          # Express API, WebSockets signaling & BullMQ workers
```

### Frontend (`client/`)
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | `16.3.4` | App Router, React Server Components, client-side routing |
| **React** | `19.2.8` | Component architecture & client UI rendering |
| **TypeScript** | `^5` | Strict type definitions and compile-time safety |
| **Tailwind CSS** | `^4` | Utility-first responsive styling framework |
| **DaisyUI** | `^5.7.28` | Semantic component library for Tailwind CSS |
| **Socket.io Client** | `^4.8.3` | Real-time signaling client for WebRTC negotiation |
| **Framer Motion** | `^13.2.0` | Motion graphics and layout transitions |
| **Lucide React** | `^1.41.0` | Modern, clean iconography |
| **React Hook Form** | `^7.87.0` | Performant form state handling and validation |
| **React Syntax Highlighter** | `^16.1.1` | Syntax highlighting for code snippets |
| **JSZip** | `^3.10.1` | Client-side zip file archive creation |
| **Next Themes** | `^0.4.6` | Flawless dark and light theme switching |

### Backend (`server/`)
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js & Express** | `^5.2.1` | REST API routes, middleware, and request handling |
| **Socket.io** | `^4.8.3` | Real-time WebSocket signaling server for WebRTC rooms |
| **TypeScript** | `^7.0.2` | Strong type-safety across server logic and schemas |
| **Prisma ORM** | `^7.10.0` | Type-safe database queries and migrations |
| **PostgreSQL / Neon** | `pg ^8.23.0` | Serverless PostgreSQL database with connection pooling |
| **BullMQ** | `^6.3.4` | High-throughput distributed background queue engine |
| **Redis / Upstash** | `ioredis ^6.0.0` | In-memory datastore backing BullMQ delay queues |
| **Cloudinary SDK** | `^2.11.0` | Cloud asset storage, signed URLs, and asset deletion |
| **Zod** | `^4.5.4` | Request payload schema validation |
| **Bcrypt** | `^6.0.0` | Secure password hashing for locked files and pastes |
| **TSX & Tsup** | `^4 / ^8` | Zero-config TypeScript execution and production bundling |

---

## 🏗️ System Architecture & Workflow

### Overall Infrastructure Architecture

```mermaid
flowchart TD
    subgraph Clients["Users / Browsers"]
        PeerA["Peer A (Sender)"]
        PeerB["Peer B (Receiver)"]
    end

    subgraph Vercel["Vercel Infrastructure"]
        Frontend["Next.js 16 Web App<br/>(passlink-01.vercel.app)"]
        API["Express Serverless API<br/>(passlink-pied.vercel.app)"]
    end

    subgraph Render["Render Infrastructure (Always-on)"]
        SocketServer["Socket.io Signaling Server<br/>(passlink-dgf1.onrender.com)"]
        Workers["BullMQ Background Workers<br/>(Paste & File Expiry)"]
    end

    subgraph Storage["Cloud Data & Media Services"]
        NeonDB[("Neon PostgreSQL<br/>Prisma ORM")]
        UpstashRedis[("Upstash Redis<br/>BullMQ Queue")]
        Cloudinary["Cloudinary Storage<br/>(Signed Uploads)"]
    end

    PeerA <-->|HTTP / UI| Frontend
    PeerB <-->|HTTP / UI| Frontend
    
    Frontend <-->|REST API| API
    API <-->|Prisma Queries| NeonDB
    API <-->|Enqueue Expiry Jobs| UpstashRedis
    
    PeerA <-->|Signaling WebSocket| SocketServer
    PeerB <-->|Signaling WebSocket| SocketServer
    
    Workers <-->|Poll Delayed Jobs| UpstashRedis
    Workers -->|Purge Expired| NeonDB
    Workers -->|Delete Assets| Cloudinary
    
    PeerA -.->|Direct Signed PUT| Cloudinary
    PeerA <=="== Direct Encrypted WebRTC P2P (RTCDataChannel) =="=> PeerB
```

---

### Deep Dive: WebRTC P2P File Transfer Protocol

The P2P file transfer mechanism implements native browser WebRTC standards (`RTCPeerConnection` and `RTCDataChannel`) coordinated by a lightweight Socket.io signaling server.

```mermaid
sequenceDiagram
    autonumber
    actor PeerA as Peer A (Sender)
    participant Socket as Socket.io Signaling (Render)
    actor PeerB as Peer B (Receiver)

    Note over PeerA,Socket: 1. Room Creation & Signaling Handshake
    PeerA->>Socket: join-room { roomId: "X89Z2A" }
    Socket-->>PeerA: Room joined (waiting for peer)
    PeerB->>Socket: join-room { roomId: "X89Z2A" }
    Socket-->>PeerA: user-joined { signalUserId: PeerB.id }

    Note over PeerA,PeerB: 2. WebRTC SDP Offer / Answer Exchange
    PeerA->>PeerA: createDataChannel("fileTransfer") & createOffer()
    PeerA->>Socket: offer { roomId, offer: sdp }
    Socket->>PeerB: offer { offer: sdp, senderId }
    PeerB->>PeerB: setRemoteDescription(offer) & createAnswer()
    PeerB->>Socket: answer { roomId, answer: sdp }
    Socket->>PeerA: answer { answer: sdp, senderId }
    PeerA->>PeerA: setRemoteDescription(answer)

    Note over PeerA,PeerB: 3. Trickle ICE Candidates (Google STUN)
    par Peer A Candidates
        PeerA->>Socket: ice-candidate { roomId, candidate }
        Socket->>PeerB: ice-candidate { candidate }
        PeerB->>PeerB: addIceCandidate(candidate)
    and Peer B Candidates
        PeerB->>Socket: ice-candidate { roomId, candidate }
        Socket->>PeerA: ice-candidate { candidate }
        PeerA->>PeerA: addIceCandidate(candidate)
    end

    Note over PeerA,PeerB: 4. Direct P2P Channel Opened (No Server Relay)
    PeerA->>PeerB: Control Message: { type: "FILE_OFFER", name, size, typeStr }
    PeerB-->>PeerA: Control Message: { type: "FILE_RESPONSE", accepted: true }

    Note over PeerA,PeerB: 5. Chunked Binary Stream with Flow Control
    loop Until All 16KB Slices Sent
        PeerA->>PeerA: Read file.slice(offset, offset + 16KB) via FileReader
        PeerA->>PeerB: dataChannel.send(ArrayBuffer)
        opt Backpressure Triggered (bufferedAmount > threshold)
            PeerA->>PeerA: Pause & wait for onbufferedamountlow
        end
    end

    Note over PeerB: 6. Blob Assembly & Auto-Download
    PeerB->>PeerB: Reassemble ArrayBuffer[] into Blob -> Trigger Browser Download
```

#### Key Engineering Highlights:
1. **Candidate Queueing:** The client employs an `iceCandidateQueueRef` to buffer incoming ICE candidates if they arrive before `setRemoteDescription` completes, eliminating race conditions.
2. **Backpressure & Memory Safety:** Large files are never read entirely into RAM at once. The sender slices the file in **16 KB chunks** (`CHUNK_SIZE = 16384`) using `Blob.slice()`. If the WebRTC internal buffer exceeds `CHUNK_SIZE * 8` (128 KB), execution halts until the browser fires `onbufferedamountlow`.
3. **Control Handshake:** Metadata (filename, file size, MIME type) is dispatched via JSON strings across the data channel. Binary transmission only begins after the recipient transmits `{ type: 'FILE_RESPONSE', accepted: true }`.
4. **Local Network (LAN) Optimization:** If both peers are on the same Wi-Fi or LAN subnet, the STUN candidates identify direct private IP routes, resulting in gigabit-class local transfers without traversing external internet routers.

---

### Deep Dive: Ephemeral Queues & Self-Destruction

1. **Paste / File Creation:** When a user creates a paste or registers a file record, the record is inserted into Neon PostgreSQL with an `expiresAt` timestamp calculated from the chosen TTL.
2. **BullMQ Job Scheduling:** The API schedules a delayed BullMQ job in Redis (`file-cleanup` or `paste-cleanup`) where `delay = expiresAt.getTime() - Date.now()`.
3. **Background Worker Execution:** Dedicated worker processes running on Render continuously process scheduled jobs:
   - For pastes: Deletes the record from PostgreSQL.
   - For files: Queries the Cloudinary public ID, requests Cloudinary API asset destruction, and deletes the database record.
4. **View Limit Self-Destruction:** Pastes configured with `maxViews` increment an access counter. Once the limit is met, the record and any remaining delayed BullMQ jobs are immediately revoked.

---

## 💻 Local Development Setup Guide

Follow these step-by-step instructions to set up, configure, and run both PassLink client and server applications on your local machine.

### Prerequisites
- **Node.js**: `v20.x` or higher installed ([Download Node.js](https://nodejs.org/))
- **npm**: `v10.x` or higher (or `pnpm` / `yarn`)
- **PostgreSQL Database**: Local PostgreSQL instance or a free cloud instance (e.g. [Neon.tech](https://neon.tech/))
- **Redis Instance**: Local Redis server or a free serverless instance (e.g. [Upstash](https://upstash.com/))
- **Cloudinary Account**: Free account for file hosting credentials ([Cloudinary](https://cloudinary.com/))

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/passlink.git
cd passlink
```

---

### 2. Configure & Run Backend (`server/`)

Open a terminal window and navigate to the `server/` directory:

```bash
cd server
```

#### Step A: Install Server Dependencies
```bash
npm install
```

#### Step B: Set Up Server Environment Variables
Create a `.env` file in `server/`:
```bash
cp .env.example .env
```
*(Or create a new `.env` file directly)*

```env
PORT=8000
NODE_ENV=development
RENDER=true

CLIENT_URL=http://localhost:3000

# PostgreSQL Connection String (Neon or Local Postgres)
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=verify-full&connect_timeout=30"
DIRECT_URL="postgresql://user:password@host/neondb?sslmode=verify-full"

# Redis Connection String (Upstash or Local Redis)
REDIS_URL="rediss://default:token@host.upstash.io:6379"

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Step C: Generate Prisma Client & Sync Database
```bash
npx prisma generate
npx prisma db push
```

#### Step D: Start the Server in Development Mode
```bash
npm run dev
```
The server will start with hot-reloading enabled via `tsx watch` at `http://localhost:8000`.

---

### 3. Configure & Run Frontend (`client/`)

Open a second terminal window and navigate to the `client/` directory:

```bash
cd client
```

#### Step A: Install Client Dependencies
```bash
npm install
```

#### Step B: Set Up Client Environment Variables
Create a `.env.local` file in `client/`:
```bash
cp .env.example .env.local
```
*(Or create a new `.env.local` file directly)*

```env
# Server-side environment variable (Next.js Server Components)
NEXT_SERVER_URL=http://localhost:8000

# Client-side environment variable (Browser fetch calls & form submission)
NEXT_PUBLIC_SERVER_URL=http://localhost:8000

# WebSockets / Signaling Server URL
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000

# Cloudinary Upload Credentials for Direct Client-side Uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

> **Note on Cloudinary Preset:** In your Cloudinary Settings under **Upload Presets**, create an **Unsigned** preset named as specified in `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` allowing client uploads.

#### Step C: Start the Next.js Development Server
```bash
npm run dev
```
The client will start at `http://localhost:3000`. Open your browser and navigate to `http://localhost:3000`.

---

## 🔑 Environment Variables Reference

### Client Environment Variables (`client/.env.local`)

| Variable | Type | Required | Description | Example / Default |
| :--- | :--- | :---: | :--- | :--- |
| `NEXT_SERVER_URL` | Server | Yes | Base URL used by Next.js Server Components to query the API. | `http://localhost:8000` |
| `NEXT_PUBLIC_SERVER_URL` | Public | Yes | Base URL used by browser client components to query REST endpoints. | `http://localhost:8000` |
| `NEXT_PUBLIC_SOCKET_URL` | Public | Yes | URL pointing to the Socket.io signaling server. | `http://localhost:8000` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public | Yes | Cloudinary cloud identifier for binary uploads. | `your_cloud_name` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`| Public | Yes | Unsigned upload preset enabled in Cloudinary dashboard. | `pastelink-upload` |

### Server Environment Variables (`server/.env`)

| Variable | Type | Required | Description | Example / Default |
| :--- | :--- | :---: | :--- | :--- |
| `PORT` | Integer | No | Port number on which the HTTP & Socket.io server listens. | `8000` (defaults to `5000`) |
| `NODE_ENV` | String | Yes | Application environment mode (`development` or `production`). | `development` |
| `RENDER` | String | No | Enables Socket.io initialization & BullMQ workers when `"true"`. | `true` |
| `CLIENT_URL` | String | Yes | Allowed origin for Express CORS and Socket.io incoming connections. | `http://localhost:3000` |
| `DATABASE_URL` | String | Yes | PostgreSQL connection string (supports Neon pooler with connection parameters). | `postgresql://...` |
| `DIRECT_URL` | String | No | Direct unpooled database connection string for Prisma migrations. | `postgresql://...` |
| `REDIS_URL` | String | Yes | Redis connection string with TLS credentials for BullMQ queue management. | `rediss://...` |
| `CLOUDINARY_CLOUD_NAME` | String | Yes | Cloudinary account cloud name for storage asset management. | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | String | Yes | Cloudinary API key used for generating signed asset queries. | `123456789012345` |
| `CLOUDINARY_API_SECRET` | String | Yes | Cloudinary API secret for authenticating deletion requests. | `secret_token` |

---

## 📡 API Endpoints Reference

### Pastes API (`/api/pastes`)
- `POST /create-paste`: Create a new paste (title, content, ttl, optional password, slug, maxViews).
- `GET /get-paste/:slug`: Retrieve paste content. Returns `{ isPasswordRequired: true }` if locked.
- `POST /protected-paste/:slug`: Unlock and retrieve password-protected paste.
- `PUT /update-paste/:slug`: Update an existing paste (content, title, slug, extend TTL, password).
- `DELETE /delete-paste/:slug`: Delete paste immediately (requires password if locked).

### Files API (`/api/files`)
- `POST /upload-url`: Register file metadata, validate size/TTL, and generate Cloudinary target public ID.
- `GET /:slug`: Fetch file metadata, download count, expiration status, and password lock flag.
- `POST /:slug/download`: Verify password & download quota, then receive file asset download URL.
- `PATCH /:slug`: Update file settings (TTL extension, slug rename, password change, download limits).
- `DELETE /:slug`: Verify password and immediately purge the file from Cloudinary and PostgreSQL.

### Health Check
- `GET /health`: Returns `{ status: "ok" }` for container and uptime monitoring.

### Socket.io Signaling Events
- `join-room`: Request to join a WebRTC session room (caps at 2 peers).
- `user-joined`: Broadcasted to existing peer when a new participant enters the room.
- `offer`: Relays WebRTC SDP offer between peers.
- `answer`: Relays WebRTC SDP answer between peers.
- `ice-candidate`: Relays WebRTC ICE candidates for NAT traversal.
- `leave-room` / `disconnecting`: Notifies peer when one side terminates the session.

---

## 📁 Repository Directory Structure

```
passlink/
├── README.md                      # Root documentation
├── client/                        # Next.js 16 Client Application
│   ├── .env.local                 # Local client environment variables
│   ├── package.json               # Client dependencies & scripts
│   ├── tsconfig.json              # TypeScript configuration
│   ├── next.config.ts             # Next.js settings
│   ├── public/                    # Static assets
│   └── src/
│       ├── api/
│       │   └── fileApi.ts         # Client API service for file operations
│       ├── app/
│       │   ├── components/        # UI components (common, home, paste, file, p2p)
│       │   ├── file/              # /file upload & /file/[slug] download views
│       │   ├── p2p/               # /p2p room lobby & /p2p/[roomId] transfer views
│       │   ├── paste/             # /paste create & /paste/[slug] view pages
│       │   ├── layout.tsx         # Global layout with ThemeProvider
│       │   └── page.tsx           # Landing page
│       ├── context/
│       │   └── SocketContext.tsx  # Socket.io connection state provider
│       └── hooks/
│           ├── useSocket.ts       # Hook for accessing socket instance
│           └── useWebRTC.ts       # Core WebRTC P2P connection & chunking engine
│
└── server/                        # Express 5 Backend & Workers
    ├── .env                       # Local server environment variables
    ├── package.json               # Server dependencies & scripts
    ├── tsconfig.json              # Server TypeScript configuration
    ├── vercel.json                # Vercel serverless deployment config
    ├── tsup.config.ts             # Build bundle configuration for Render
    ├── socket.ts                  # Socket.io signaling server logic
    ├── prisma/
    │   └── schema.prisma          # Database schema (User, Paste, FileRecord)
    └── src/
        ├── app.ts                 # Express application initialization & middleware
        ├── server.ts              # HTTP server, socket bootstrap & worker init
        ├── config/                # Prisma, Redis, and Cloudinary configurations
        ├── controllers/           # Paste and File request controllers
        ├── middleware/            # Error handling middleware
        ├── queues/                # BullMQ queue definitions
        ├── routes/                # Express router endpoints
        ├── schemas/               # Zod validation schemas
        ├── services/              # Business logic & storage deletion services
        ├── utils/                 # Custom errors & helper utilities
        └── workers/               # BullMQ background workers (self-destruction)
```

---

## 🔒 Security & Privacy Architecture

- **True Peer-to-Peer:** Files sent via P2P never touch our servers or disks. WebRTC encrypts all media and data channels end-to-end using DTLS (Datagram Transport Layer Security).
- **Hashed Credentials:** All passwords protecting pastes and file records are irreversibly hashed using **Bcrypt** with salt rounds before database persistence.
- **Client Direct Uploads:** File uploads directly stream to Cloudinary using signed payloads, ensuring the API server is never a bottleneck and does not store unencrypted files locally.
- **Automated Purging:** Expired pastes and files are deleted in the background by Redis-backed BullMQ workers on exact TTL expiry timestamps.

---
