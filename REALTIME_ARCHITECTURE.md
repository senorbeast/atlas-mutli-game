# Realtime Architecture

The frontend treats `src/network/atlasClient.ts` as the only low-level WebSocket/protobuf transport. Components use hooks and Zustand state, never the raw socket.

## Module Boundary

```mermaid
flowchart TD
  UI["Game UI components"]
  Hook["useAtlasRealtime<br/>connection lifecycle"]
  GameHook["useAtlasWordGame<br/>submission UX"]
  Client["atlasClient<br/>WebSocket + protobuf"]
  Store["Zustand store<br/>RealtimeSlice/GameSlice"]
  Backend["atlas-backend"]

  UI --> Hook
  UI --> GameHook
  UI --> Store
  Hook --> Client
  Hook --> Store
  GameHook --> Store
  GameHook --> Client
  Client <--> Backend
```

## WebSocket Lifecycle

`useAtlasRealtime(roomId, canConnect)` owns the connection. Its connection effect depends only on `roomId` and `canConnect`, so chat messages, scores, turns, errors, and room snapshots do not reconnect the socket.

Event handlers read the latest Zustand actions through `useStore.getState()`. This keeps the handlers stable for the lifetime of one connection while still applying updates to current state.

Missing-turn repair is a separate effect. It can request `REQUEST_GAME_STATE`, but it must never reconnect the socket.

```mermaid
stateDiagram-v2
  [*] --> idle
  idle --> connecting: roomId && canConnect
  connecting --> connected: SEND_ON_CONNECT_ACK
  connecting --> disconnected: error/close
  connected --> disconnected: socket close
  disconnected --> connecting: reconnect by room/gate change
  connected --> disconnecting: roomId removed or gate closes
  disconnecting --> idle: cleanup
```

## Hydration Order

On ACK:

1. Store room id, player id, game kind, turn mode, players, scores, and game snapshot.
2. Fetch latest chat history over HTTP.
3. Replace chat history with the latest page.

On accepted backend moves:

1. `BROADCAST_GAME_UPDATE` adds the accepted city event.
2. `RESPOND_GAME_STATE` replaces authoritative game history and turn metadata.
3. `BROADCAST_ROOM_UPDATE` updates players, scores, and active-player highlight.

```mermaid
sequenceDiagram
  participant BE as Backend
  participant Client as atlasClient
  participant Hook as useAtlasRealtime
  participant Store as Zustand

  BE-->>Client: SEND_ON_CONNECT_ACK
  Client-->>Hook: ack
  Hook->>Store: setConnectAck
  Hook->>Client: fetchChatHistory
  Client-->>Hook: latest chat page
  Hook->>Store: setChatHistoryPage(replace)
  BE-->>Client: BROADCAST_GAME_UPDATE
  Client-->>Hook: gameUpdate
  Hook->>Store: addGameEvent
  BE-->>Client: RESPOND_GAME_STATE
  Hook->>Store: setGameState
  BE-->>Client: BROADCAST_ROOM_UPDATE
  Hook->>Store: setRoomSnapshot
```

## Chat Pagination

Chat history is loaded latest-first from `/api/rooms/{roomId}/chat`. The store reverses pages into chronological display order, dedupes by message id, and prepends older pages on scroll-up.

Live chat messages use the same store path and are deduped by id, so HTTP history and WebSocket broadcasts can overlap safely.

```mermaid
flowchart LR
  Scroll["Scroll near top"] --> Fetch["fetchChatHistory(before=nextCursor)"]
  Fetch --> Page["latest-first older page"]
  Page --> Reverse["reverse for chronological display"]
  Reverse --> Dedupe["dedupe by message id"]
  Dedupe --> Prepend["prepend older messages"]
```

## Atlas City Flow

The hook performs fast local checks for empty, unknown, duplicate, wrong-continuation, disconnected, assigning-turn, and not-your-turn cases. The backend remains authoritative: the globe/history updates only after backend accepted updates or snapshots.

```mermaid
flowchart TD
  Submit["User submits city"]
  Local["Local validation"]
  Send["SEND_GAME_UPDATE"]
  RejectLocal["Toast local error"]
  RejectServer["SEND_ERROR<br/>server rejection"]
  Accepted["BROADCAST_GAME_UPDATE"]
  Snapshot["RESPOND_GAME_STATE"]
  Room["BROADCAST_ROOM_UPDATE"]
  Render["Render globe arc, last cities, score, turn"]

  Submit --> Local
  Local -- invalid --> RejectLocal
  Local -- valid --> Send
  Send --> Accepted --> Snapshot --> Room --> Render
  Send --> RejectServer
```

## Future Games

New games should reuse the realtime layer by adding:

- A game kind.
- Domain mapping between protobuf payloads and frontend state.
- A game hook that validates local UX constraints and sends typed actions through `atlasClient`.
- UI components that consume store selectors instead of protobuf messages directly.
