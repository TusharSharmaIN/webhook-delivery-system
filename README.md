# Webhook Delivery System

A production-grade webhook delivery system built to learn backend reliability patterns: HMAC signing, exponential backoff with jitter, dead-letter tracking, and multi-service architecture. Not a toy CRUD app — the point is the failure handling.

## Live demo

- **Dashboard:** https://webhook-delivery-system-pearl.vercel.app
- **Core API:** https://core-api-9rfw.onrender.com (`/api/docs` for Swagger)
- **Receiver (fake customer endpoint):** https://receiver-4aje.onrender.com (`/api/docs` for Swagger)
- **Event source (fake producer):** https://event-source.onrender.com

> Free-tier hosting: services may take 30–60s to wake up after inactivity. Auto-fire is paused by default — resume it from the dashboard header to see live traffic.

## What this is

Three services simulate a real webhook pipeline:

- **`event-source`** — fires random business events (`order.created`, `user.signup`, `payment.failed`) on a timer
- **`core-api`** — the brain: tracks customers/subscriptions, fans out events, signs payloads with HMAC-SHA256, retries failures with exponential backoff + jitter, tracks dead letters
- **`receiver`** — a fake customer endpoint that verifies signatures and can simulate failure (down / slow / always-fail) for testing retry behavior

Plus a React dashboard for creating customers, subscribing to events, firing test events, and watching deliveries happen live.

## Stack

- **Backend:** NestJS + TypeScript, TypeORM (Postgres), BullMQ (Redis)
- **Frontend:** React + Vite + TypeScript + Tailwind
- **Infra (local):** Docker Compose
- **Infra (deployed):** Render (backend services) · Neon (Postgres) · Upstash (Redis) · Vercel (frontend)

Retry policy: 3 attempts, exponential backoff with jitter (base 10s, cap 80s). After 3 failures, an event is marked `dead` — visible via the dead-letter endpoints, never silently dropped.

## Running locally

Requires Docker Desktop and Node 18+.

```bash
git clone <this-repo>
cd webhook-delivery-system

# copy env files and fill in local values (see .env in each service for shape)
cp services/core-api/.env.example services/core-api/.env      # if present
cp services/receiver/.env.example services/receiver/.env
cp services/event-source/.env.example services/event-source/.env

make up
```

Then:

```bash
cd services/core-api
npm run migration:run   # first time only, against local Postgres
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Notes

- **Signing:** every payload is HMAC-SHA256 signed with a per-customer secret, verified with `timingSafeEqual` (not naive string comparison)
- **Backoff:** custom BullMQ backoff strategy with jitter — prevents synchronized retry storms against a recovering endpoint
- **Dead letters:** Postgres is the source of truth for "permanently failed," not just BullMQ's internal state — survives Redis restarts, joinable with customer/event data
- **Receiver secrets:** persisted in Postgres (not memory) so they survive the frequent restarts of free-tier hosting
- **Idempotency:** every delivery carries an `X-Event-Id` header; the receiver dedupes on it
