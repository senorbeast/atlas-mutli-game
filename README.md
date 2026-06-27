# atlas-mutli-game

Next.js/R3F frontend for Atlas multiplayer rooms, chat, turn-aware city submission, and globe animation.

## Setup

```bash
pnpm install
pnpm proto:gen
```

## Run

Start the Go backend first, then:

```bash
pnpm dev
```

By default the websocket client connects to `ws://localhost:8080`. Override with `NEXT_PUBLIC_ATLAS_WS_URL` and `NEXT_PUBLIC_ATLAS_HTTP_URL` when needed.

## Checks

```bash
pnpm proto:gen
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

Frontend unit/E2E test dependencies are not installed yet. See `TESTING.md` for the production regression plan before enabling `pnpm test` in CI.

## Manual WebSocket Verification

1. Run `go run .` from `atlas-backend`.
2. Run `pnpm dev` from this folder.
3. Create a room and join with a player name.
4. Open the same room in a second browser/client with another name.
5. Confirm one active turn, accepted city broadcasts, score updates, chat sender names, unread counts, and no reconnects during normal chat/game updates.

## Architecture Docs

- `../ARCHITECTURE.md`: cross-project diagrams and runtime flows.
- `AI_AGENT_GUIDE.md`: frontend architecture/style guide for agents.
- `BACKEND_REQUIREMENTS.md`: frontend-facing backend contract.
- `REALTIME_ARCHITECTURE.md`: websocket lifecycle and event hydration notes.
- `TESTING.md`: frontend regression test plan.
