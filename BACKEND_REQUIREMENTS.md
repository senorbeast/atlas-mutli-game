# Backend Requirements For Frontend Multiplayer

This frontend now supports local player names, chat unread state, city validation, and local globe animation. The backend still needs the items below before this can be production-authoritative multiplayer.

## Room And Player Identity

- Add a join/create flow that accepts a validated display name before a WebSocket connection becomes an active player.
- Include `playerId`, `displayName`, `hearts`, `score`, host/owner status, and active/turn state in the connect ACK.
- Broadcast player joined, player left, player updated, host changed, room status changed, and room closed events.
- Return room metadata from HTTP APIs: `roomId`, `gameKind`, `status`, `maxPlayers`, players, and whether the game has started.

## Chat

- Backend should derive sender identity from the WebSocket connection and ignore client-provided sender ids.
- Validate chat content server-side: trim, reject empty content, enforce max length.
- Broadcast chat with stable `messageId`, `senderId`, `senderName`, `content`, and server timestamp.
- Return typed protocol errors for invalid payloads, unauthorized rooms, closed rooms, and rate limits.

## Atlas Word Game

- Make the backend authoritative for accepted cities, city validation, turn order, repeated-city rules, scores, hearts, and game start/end state.
- Share one source of truth for city normalization and validation between frontend and backend, or expose the backend's normalized accepted city in game events.
- Implement accepted/rejected game update broadcasts with `gameKind`, `moveId`, `playerId`, `city`, `scoreDelta`, and rejection reason.
- Implement `REQUEST_GAME_STATE` so reconnects receive the full accepted city history and current turn.

## Protocol

- Keep plain WebSocket plus protobuf unless intentionally changed.
- Add a version field or protocol negotiation before production.
- Normalize proto field names to snake_case before more clients depend on the current mixed casing.
- Add heartbeat/ping or timeout behavior so the frontend can show reconnecting/disconnected states accurately.
