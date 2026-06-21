# Atlas Frontend AI Agent Guide

This guide documents the current frontend architecture, structure, style, and safe extension points for AI agents.

The project directory is named `atlas-mutli-game` on disk. Treat that spelling as authoritative for paths and commands.

## Overview

`atlas-mutli-game` is a Next.js 13 App Router frontend built from a React Three Fiber starter. It uses:

- Next.js App Router under `app/`.
- React 18 client components.
- React Three Fiber and Drei for persistent canvas rendering.
- `three-globe` for the globe.
- Tailwind CSS for styling.
- Zustand with Immer middleware for local state.
- Heroicons and React Spring for UI icons/animation.
- PWA and bundle analyzer wrappers in `next.config.js`.

Current behavior:

- `/` renders a main page overlay on top of a globe.
- `/game` renders a game overlay on top of the globe with static players, input, chat, and a sample travel arc.
- `/try` renders shader experiments.
- Room, player, and chat data are mostly static.
- Local word submission state is stored in Zustand.
- A Socket.IO hook exists, but it is not wired into the app and is not compatible with the current Go backend protocol.

## App Structure

```text
.
|-- app/
|   |-- layout.tsx
|   |-- page.tsx
|   |-- game/page.tsx
|   |-- try/page.tsx
|   |-- head.tsx
|   `-- global.css
|-- src/
|   |-- components/
|   |   |-- dom/
|   |   |   |-- Layout.tsx
|   |   |   |-- MainPage/
|   |   |   `-- GamePage/
|   |   `-- canvas/
|   |       |-- Scene.tsx
|   |       |-- View.tsx
|   |       |-- VGlobe.tsx
|   |       |-- GlobeTravelArc.tsx
|   |       |-- Word.tsx
|   |       `-- try/
|   |-- helpers/
|   |-- store/
|   `-- templates/
|-- public/
|-- next.config.js
|-- tailwind.config.js
|-- tsconfig.json
`-- package.json
```

## Route Responsibilities

`app/layout.tsx`

- Defines metadata.
- Imports global Tailwind CSS.
- Wraps all pages in `components/dom/Layout`.

`app/page.tsx`

- Client route for the main lobby screen.
- Dynamically imports R3F components with `ssr: false`.
- Renders `MainPage` as a DOM overlay and `VGlobe` inside `View`.

`app/game/page.tsx`

- Client route for gameplay.
- Renders `GamePage` overlay and globe scene.
- Adds a sample `GlobeTravelArc` and `Word` labels for New York and Sydney.

`app/try/page.tsx`

- Experimental route for shader/canvas work.
- Keep experiments isolated here unless they become product UI.

## Canvas Architecture

The canvas layer uses the common R3F "persistent canvas with views" pattern:

- `src/components/dom/Layout.tsx` renders a fixed `Scene` once for the app.
- `src/components/canvas/Scene.tsx` creates the shared `<Canvas>`, renders `r3f.Out`, and preloads assets.
- `src/helpers/global.ts` creates a `tunnel-rat` tunnel named `r3f`.
- `src/helpers/Three.tsx` sends page-specific canvas children into the persistent canvas through `r3f.In`.
- `src/components/canvas/View.tsx` creates a DOM tracking div and a Drei `View` bound to that div.

Use this pattern for new 3D content:

1. Add scene objects under `src/components/canvas`.
2. Render them inside `View` from the page route.
3. Use dynamic imports with `ssr: false` for browser-only canvas components.
4. Put common camera/lights/background in `Common` or a small adjacent helper.

Important canvas notes:

- `VGlobe` uses `three-globe` and external image URLs from `unpkg.com`.
- `VGlobe` changes camera position through `useThree`.
- `Word` faces the camera every frame and changes color on hover.
- `GlobeTravelArc` computes cubic Bezier control points from latitude/longitude.

## DOM Component Structure

`src/components/dom/MainPage`

- `index.tsx` composes the lobby overlay.
- `Navbar.tsx` renders logo, static nav links, dark toggle, and "Get started".
- `Rooms.tsx` owns static room data, room filtering, and navigation to `/game`.
- `Room.tsx` renders a room card, locked-room password input state, and join navigation.
- `DarkToggle.tsx` toggles global dark mode from Zustand and animates the icon with React Spring.

`src/components/dom/GamePage`

- `index.tsx` composes player list, chat, settings, previous words, and input.
- `Player.tsx` renders static player avatars and active player highlight.
- `GameInput.tsx` validates continuation against the last submitted word and updates Zustand.
- `PrevWords.tsx` displays the last five submitted words.
- `Chat.tsx` renders static chat messages and hover/input behavior.
- `SettingsBar.tsx` currently only navigates back to `/`.
- `GameInfo.tsx` is currently empty.

Overlay convention:

- Pages place DOM overlays above canvas with absolute positioning and `z-index`.
- Containers often use `pointer-events-none`; interactive children use `pointer-events-auto`.
- Preserve this pattern when adding controls over the globe.

## State Management

The global store lives in `src/store/store.ts` and composes four slices with Zustand and Immer:

- `ViewSlice`: `darkMode`, `toggleMode`
- `RoomSlice`: `rooms`, `addRoom`
- `GameSlice`: `id`, `name`, `players`, `gameMode`, `wordsSubmitted`, and mutators
- `SocketSlice`: `socket`, `uid`, `users`

Style for store changes:

- Add cohesive state to the relevant slice.
- If state spans gameplay and networking, prefer a new clearly named slice over overloading `GameSlice`.
- Keep slice mutators small and explicit.
- Use Zustand selectors in components to avoid broad rerenders.
- The project has `strict: false`; still write typed state and component props where practical.

Important current issue:

- `GameInput` calls `setWordValid(wordValidation(userInput))` and then immediately checks `wordValid`, which may still contain the previous React state value. If changing this component, compute validation in local variables inside the Enter handler.

## Networking and Backend Integration

`src/templates/hooks/useSocket.tsx` creates a Socket.IO client. The Go backend uses plain WebSocket with protobuf binary frames.

Do not wire `useSocket` to the Go backend as-is. A correct backend client should:

- Use browser `WebSocket`, not Socket.IO, unless the backend is changed.
- Open `ws://localhost:8080/{roomId}` after calling `GET /create`.
- Send and receive binary protobuf messages.
- Decode `ServerToClientMessage`.
- Encode `ClientToServerMessage`.
- Store `roomId`, `playerId`, connection status, players, chat, and game state in Zustand.

Suggested future structure:

```text
src/
|-- network/
|   |-- atlasClient.ts
|   `-- protobuf/
|-- store/
|   `-- NetworkSlice.ts
```

If adding generated TypeScript protobuf code, keep it out of DOM and canvas component folders.

## Styling Conventions

Styling is Tailwind-first:

- Global utility classes and reusable component classes live in `app/global.css`.
- Common classes include `standard-color`, `standard-border`, `primary-color`, `secondary-color`, `button`, `input`, and `card`.
- Dark mode is class-based through Tailwind and `ViewSlice.darkMode`.
- UI currently uses rounded, playful cards/buttons and bright accent colors.

When editing UI:

- Keep DOM overlays readable against the globe.
- Preserve `pointer-events` intent so canvas orbit controls and UI controls do not fight each other.
- Prefer existing global classes before inventing one-off utility piles.
- Keep route-level canvas imports dynamic with `ssr: false`.

## TypeScript and Config Notes

`tsconfig.json`:

- `strict` is disabled.
- `allowJs` is enabled.
- Path alias maps `@/*` to both `app/*` and `src/*`.
- Target is `es5`.

`next.config.js`:

- Wraps config with PWA and bundle analyzer plugins.
- Ignores TypeScript build errors.
- Adds loaders for audio and GLSL shader files.
- Excludes `sharp` from the browser build.

`tailwind.config.js`:

- Scans `app/**/*` and `src/components/**/*`.
- If you add Tailwind classes under `src/helpers`, `src/store`, or a new `src/network` UI file, update `content`.

## Commands

Install dependencies:

```bash
pnpm install
```

Run locally:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Lint:

```bash
pnpm lint
pnpm eslint
```

Notes:

- `pnpm lint` targets `app`.
- `pnpm eslint` targets `src`.
- The `prettier` script currently appears to have an extra trailing quote in `package.json`; verify before relying on it.

## Common Change Patterns

Add a new page:

1. Create `app/{route}/page.tsx`.
2. Use `'use client'` if it needs browser APIs, state, R3F, or navigation hooks.
3. Dynamically import canvas pieces with `ssr: false`.
4. Reuse `View` and `Common` for 3D sections.

Add a new game UI control:

1. Place it under `src/components/dom/GamePage`.
2. Use existing `button` or `input` classes when suitable.
3. Ensure the parent path allows interaction with `pointer-events-auto`.
4. Store shared state in Zustand, local-only state in the component.

Add a new globe visual:

1. Place reusable 3D components under `src/components/canvas`.
2. Use helpers like `latLonToVec3` for coordinate conversion.
3. Avoid DOM APIs inside components that may render server-side. Prefer client-only dynamic imports.

Integrate backend chat:

1. Add a plain WebSocket/protobuf client.
2. Call backend `/create` or join with a room id.
3. Store connect ACK data in Zustand.
4. Replace static `messages` in `Chat.tsx` with store-backed messages.
5. Encode `SEND_CHAT_MESSAGE` on submit.
6. Decode `BROADCAST_CHAT_MESSAGE` and append to chat state.

## Known Gaps

- Frontend is not connected to backend.
- Socket hook uses Socket.IO while backend is not Socket.IO.
- Static room, player, and chat data.
- No TypeScript strictness.
- `next.config.js` ignores TypeScript build errors.
- `GameInfo.tsx` is empty.
- Several components log to console during render or route execution.
- `GameInput` validation state can be stale on Enter.
- External globe textures depend on `unpkg.com`.

