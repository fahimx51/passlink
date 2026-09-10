# PassLink

**Pass the Link to someone.**

PassLink is a privacy-first app for moving data between people quickly and without a trace. Share text and code with a self-destruct timer, host password-locked files with an expiry date, or send files directly between two browsers over WebRTC with nothing touching a server in between.

Repo: [github.com/fahimx51/passlink](https://github.com/fahimx51/passlink)

---

## Live deployments

| Component | Role | URL |
| :--- | :--- | :--- |
| Frontend | Next.js 16 App Router UI | [passlink-01.vercel.app](https://passlink-01.vercel.app/) |
| API | Express REST API (serverless) | [passlink-pied.vercel.app](https://passlink-pied.vercel.app/) |
| Signaling & workers | Socket.io + BullMQ | [passlink-dgf1.onrender.com](https://passlink-dgf1.onrender.com/) |

---

## Features

### Direct peer-to-peer file transfer
- Socket.io signaling puts two clients into a session identified by a 6-character room code, capped at two peers per room.
- Files stream directly between browsers over an `RTCDataChannel` — the backend never receives, stores, or touches transfer payloads.
- When both peers are on the same LAN, ICE negotiation finds a direct local route, so transfers run at local network speed instead of routing out to the internet and back.
- Files are read and sent in 16 KB chunks with backpressure handling, so large files don't get fully buffered into memory.
- Transfers start only after an explicit offer/accept/reject handshake — nothing sends until the receiving peer agrees.

### Ephemeral code and text sharing
- Syntax highlighting for JavaScript, TypeScript, Python, HTML/CSS, JSON, Go, Rust, and more.
- Optional password protection, hashed with bcrypt.
- Self-destructs on a configurable TTL (1–15 days) or after a maximum number of views.
- Custom, alphanumeric vanity slugs.

### Cloud-backed temporary file storage
- Uploads go straight from the browser to Cloudinary via signed URLs — file bytes never pass through the API server.
- Multiple files can be packaged into a `.zip` in the browser before upload, via JSZip.
- Files can be password-protected, given a download quota, and set to expire.
- A BullMQ worker queue deletes expired files from Cloudinary and the database automatically.

### Interface
- Built with Tailwind CSS v4 and DaisyUI v5, with a system-aware light/dark theme that persists across visits.
- Responsive down to small phone screens.

---

## Tech stack

Monorepo with two packages:

```
passlink/
├── client/          # Next.js frontend
└── server/          # Express API, Socket.io signaling & BullMQ workers
```

### Frontend (`client/`)

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| Next.js | `16.3.4` | App Router, React Server Components, routing |
| React | `19.2.8` | Component architecture & rendering |
| TypeScript | `^5` | Type safety |
| Tailwind CSS | `^4` | Styling |
| DaisyUI | `^5.7.28` | Component classes on top of Tailwind |
| Socket.io Client | `^4.8.3` | Signaling client for WebRTC negotiation |
| Framer Motion | `^13.2.0` | Motion and layout transitions |
| Lucide React | `^1.41.0` | Icons |
| React Hook Form | `^7.87.0` | Form state and validation |
| React Syntax Highlighter | `^16.1.1` | Code snippet highlighting |
| JSZip | `^3.10.1` | Client-side zip creation |
| Next Themes | `^0.4.6` | Light/dark theme switching |

### Backend (`server/`)

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| Node.js & Express | `^5.2.1` | REST routes and middleware |
| Socket.io | `^4.8.3` | WebSocket signaling server for WebRTC rooms |
| TypeScript | `^7.0.2` | Type safety across server logic |
| Prisma ORM | `^7.10.0` | Database queries and migrations |
| PostgreSQL (Neon) | `pg ^8.23.0` | Serverless Postgres with connection pooling |
| BullMQ | `^6.3.4` | Background job queue |
| Redis (Upstash) | `ioredis ^6.0.0` | Backing store for BullMQ |
| Cloudinary SDK | `^2.11.0` | Asset storage, signed URLs, deletion |
| Zod | `^4.5.4` | Request payload validation |
| Bcrypt | `^6.0.0` | Password hashing |
| tsx | `^4` | TypeScript execution in development |
| tsup | `^8` | Production bundling |

---

## Architecture

```mermaid
flowchart TD
    subgraph Clients["Users / Browsers"]
        PeerA["Peer A (Sender)"]
        PeerB["Peer B (Receiver)"]
    end

    subgraph Vercel["Vercel"]
        Frontend["Next.js 16 Web App<br/>(passlink-01.vercel.app)"]
        API["Express Serverless API<br/>(passlink-pied.vercel.app)"]
    end

    subgraph Render["Render (always-on)"]
        SocketServer["Socket.io Signaling Server<br/>(passlink-dgf1.onrender.com)"]
        Workers["BullMQ Background Workers<br/>(paste & file expiry)"]
    end

    subgraph Storage["Data & media"]
        NeonDB[("Neon PostgreSQL<br/>Prisma ORM")]
        UpstashRedis[("Upstash Redis<br/>BullMQ queue")]
        Cloudinary["Cloudinary<br/>(signed uploads)"]
    end

    PeerA <-->|HTTP / UI| Frontend
    PeerB <-->|HTTP / UI| Frontend

    Frontend <-->|REST API| API
    API <-->|Prisma queries| NeonDB
    API <-->|Enqueue expiry jobs| UpstashRedis

    PeerA <-->|Signaling WebSocket| SocketServer
    PeerB <-->|Signaling WebSocket| SocketServer

    Workers <-->|Poll delayed jobs| UpstashRedis
    Workers -->|Purge expired| NeonDB
    Workers -->|Delete assets| Cloudinary

    PeerA -.->|Direct signed PUT| Cloudinary
    PeerA <=="Direct WebRTC P2P (RTCDataChannel)"=> PeerB
```

### WebRTC P2P transfer protocol

```mermaid
sequenceDiagram
    autonumber
    actor PeerA as Peer A (Sender)
    participant Socket as Socket.io Signaling (Render)
    actor PeerB as Peer B (Receiver)

    Note over PeerA,Socket: 1. Room join
    PeerA->>Socket: join-room { roomId: "X89Z2A" }
    Socket-->>PeerA: Room joined, waiting for peer
    PeerB->>Socket: join-room { roomId: "X89Z2A" }
    Socket-->>PeerA: user-joined { signalUserId: PeerB.id }

    Note over PeerA,PeerB: 2. SDP offer / answer exchange
    PeerA->>PeerA: createDataChannel("fileTransfer") & createOffer()
    PeerA->>Socket: offer { roomId, offer: sdp }
    Socket->>PeerB: offer { offer: sdp, senderId }
    PeerB->>PeerB: setRemoteDescription(offer) & createAnswer()
    PeerB->>Socket: answer { roomId, answer: sdp }
    Socket->>PeerA: answer { answer: sdp, senderId }
    PeerA->>PeerA: setRemoteDescription(answer)

    Note over PeerA,PeerB: 3. Trickle ICE candidates (Google STUN)
    par Peer A candidates
        PeerA->>Socket: ice-candidate { roomId, candidate }
        Socket->>PeerB: ice-candidate { candidate }
        PeerB->>PeerB: addIceCandidate(candidate)
    and Peer B candidates
        PeerB->>Socket: ice-candidate { roomId, candidate }
        Socket->>PeerA: ice-candidate { candidate }
        PeerA->>PeerA: addIceCandidate(candidate)
    end

    Note over PeerA,PeerB: 4. Direct channel opens — no server relay
    PeerA->>PeerB: Control message: { type: "FILE_OFFER", name, size, typeStr }
    PeerB-->>PeerA: Control message: { type: "FILE_RESPONSE", accepted: true }

    Note over PeerA,PeerB: 5. Chunked binary stream with flow control
    loop Until all 16 KB slices sent
        PeerA->>PeerA: Read file.slice(offset, offset + 16KB) via FileReader
        PeerA->>PeerB: dataChannel.send(ArrayBuffer)
        opt Backpressure triggered (bufferedAmount > threshold)
            PeerA->>PeerA: Pause & wait for onbufferedamountlow
        end
    end

    Note over PeerB: 6. Blob assembly & download
    PeerB->>PeerB: Reassemble ArrayBuffer[] into Blob, trigger download
```

**Notes on the implementation:**
- Incoming ICE candidates that arrive before `setRemoteDescription` resolves are held in an `iceCandidateQueueRef` to avoid a race condition.
- Files are never read fully into memory. The sender slices with `Blob.slice()` at `CHUNK_SIZE = 16384`, and pauses sending once the channel's buffered amount passes `CHUNK_SIZE * 8` (128 KB), resuming on `onbufferedamountlow`.
- File metadata (name, size, MIME type) goes over the data channel as JSON before any binary data. Binary transfer only starts once the receiver replies `{ type: 'FILE_RESPONSE', accepted: true }`.
- On a shared LAN, STUN candidates resolve to private IP routes, so transfers don't leave the local network.

### Expiry and self-destruction

1. On creation, a paste or file record is inserted into Postgres with an `expiresAt` timestamp derived from the chosen TTL.
2. The API schedules a delayed BullMQ job (`file-cleanup` or `paste-cleanup`) in Redis, with `delay = expiresAt.getTime() - Date.now()`.
3. A worker on Render processes the job when it fires: pastes are deleted from Postgres; files are also purged from Cloudinary via their public ID.
4. Pastes with a `maxViews` limit track an access counter. Once the limit is hit, the record and any pending BullMQ job for it are removed immediately.

---

## Local development

### Prerequisites
- Node.js v20 or higher
- npm v10 or higher (or pnpm / yarn)
- A PostgreSQL database — local, or a free instance from [Neon](https://neon.tech/)
- A Redis instance — local, or a free instance from [Upstash](https://upstash.com/)
- A [Cloudinary](https://cloudinary.com/) account

### 1. Clone the repo

```bash
git clone https://github.com/fahimx51/passlink.git
cd passlink
```

### 2. Server (`server/`)

```bash
cd server
npm install
cp .env.example .env   # or create .env manually, see below
```

`server/.env`:

```env
PORT=8000
NODE_ENV=development
RENDER=true

CLIENT_URL=http://localhost:3000

# Postgres (Neon or local)
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=verify-full&connect_timeout=30"
DIRECT_URL="postgresql://user:password@host/neondb?sslmode=verify-full"

# Redis (Upstash or local)
REDIS_URL="rediss://default:token@host.upstash.io:6379"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Runs at `http://localhost:8000` with hot reload via `tsx watch`.

### 3. Client (`client/`)

```bash
cd client
npm install
cp .env.example .env.local   # or create .env.local manually, see below
```

`client/.env.local`:

```env
NEXT_SERVER_URL=http://localhost:8000
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

In Cloudinary, under **Settings → Upload Presets**, create an **unsigned** preset with the name you use for `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` so the client can upload directly.

```bash
npm run dev
```

Runs at `http://localhost:3000`.

---

## Environment variables

### Client (`client/.env.local`)

| Variable | Required | Description |
| :--- | :---: | :--- |
| `NEXT_SERVER_URL` | Yes | Base URL used by Server Components to call the API |
| `NEXT_PUBLIC_SERVER_URL` | Yes | Base URL used by the browser to call the API |
| `NEXT_PUBLIC_SOCKET_URL` | Yes | URL of the Socket.io signaling server |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Yes | Unsigned upload preset name |

### Server (`server/.env`)

| Variable | Required | Description |
| :--- | :---: | :--- |
| `PORT` | No | Port for HTTP & Socket.io (defaults to `5000`) |
| `NODE_ENV` | Yes | `development` or `production` |
| `RENDER` | No | Set `"true"` to enable Socket.io & BullMQ workers on boot |
| `CLIENT_URL` | Yes | Allowed CORS / Socket.io origin |
| `DATABASE_URL` | Yes | Postgres connection string (pooled) |
| `DIRECT_URL` | No | Direct, unpooled connection string for Prisma migrations |
| `REDIS_URL` | Yes | Redis connection string for BullMQ |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |

---

## API reference

### Pastes (`/api/pastes`)
- `POST /create-paste` — create a paste (title, content, ttl, optional password, slug, maxViews)
- `GET /get-paste/:slug` — fetch a paste; returns `{ isPasswordRequired: true }` if locked
- `POST /protected-paste/:slug` — unlock a password-protected paste
- `PUT /update-paste/:slug` — update content, title, slug, TTL, or password
- `DELETE /delete-paste/:slug` — delete immediately (password required if locked)

### Files (`/api/files`)
- `POST /upload-url` — register file metadata, validate size/TTL, get a Cloudinary target
- `GET /:slug` — fetch file metadata, download count, expiry status, lock flag
- `POST /:slug/download` — verify password/quota and get a download URL
- `PATCH /:slug` — update TTL, slug, password, or download limit
- `DELETE /:slug` — verify password and purge from Cloudinary and Postgres

### Health
- `GET /health` — returns `{ status: "ok" }`

### Socket.io events
- `join-room` — join a session room (max 2 peers)
- `user-joined` — sent to the existing peer when someone else joins
- `offer` / `answer` / `ice-candidate` — WebRTC signaling relay
- `leave-room` / `disconnecting` — sent when a peer leaves

---

## Repository structure

```
passlink/
├── README.md
├── client/
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── fileApi.ts
│       ├── app/
│       │   ├── components/        # common, home, paste, file, p2p
│       │   ├── file/               # /file upload & /file/[slug]
│       │   ├── p2p/                # /p2p lobby & /p2p/[roomId]
│       │   ├── paste/               # /paste create & /paste/[slug]
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── context/
│       │   └── SocketContext.tsx
│       └── hooks/
│           ├── useSocket.ts
│           └── useWebRTC.ts        # WebRTC connection & chunking engine
│
└── server/
    ├── .env
    ├── package.json
    ├── tsconfig.json
    ├── vercel.json
    ├── tsup.config.ts
    ├── socket.ts
    ├── prisma/
    │   └── schema.prisma            # User, Paste, FileRecord
    └── src/
        ├── app.ts
        ├── server.ts
        ├── config/                  # Prisma, Redis, Cloudinary
        ├── controllers/
        ├── middleware/
        ├── queues/
        ├── routes/
        ├── schemas/
        ├── services/
        ├── utils/
        └── workers/                 # expiry / self-destruction
```

---

## Security and privacy

- P2P transfers never touch the server — WebRTC data channels are encrypted in transit via DTLS.
- Passwords on pastes and files are hashed with bcrypt before storage, never stored in plain text.
- File uploads go directly from the browser to Cloudinary via signed URLs, so the API never handles raw file bytes.
- Expired pastes and files are removed automatically by BullMQ workers running against their TTL.