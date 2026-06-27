# Frontend Regression Testing

Current CI gates run the production-safe checks already available in the project:

- `pnpm proto:gen`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm format:check`
- `pnpm build`

The project does not yet include a frontend test runner. Before enabling `pnpm test` in CI, add package support for:

- Vitest for store, hook, and network adapter unit tests.
- React Testing Library for component-level UI states.
- Playwright for two-client websocket regression flows.

Recommended coverage:

- Realtime store hydrates ACK snapshots, player names, scores, active turn, and game snapshots.
- Room updates change active player and scores.
- Game state replaces accepted-city history and current turn.
- Game updates dedupe accepted cities by hash.
- Chat messages dedupe by id.
- Unread count increments only for incoming messages while chat is closed.
- Chat history pagination prepends older messages without duplicates.
- `useAtlasWordGame` rejects empty, unknown, duplicate, wrong-continuation, not-connected, assigning-turn, and not-your-turn submissions.
- A mocked `atlasClient` proves normal store changes never call `connect()` again.
