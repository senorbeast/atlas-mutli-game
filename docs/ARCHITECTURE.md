# Atlas Multi-Game Architecture

## Project Overview

This is a Next.js application that uses React Three Fiber to render 3D graphics in the browser. The application is a front-end for a multiplayer game, and it is intended to communicate with a back-end server via WebSockets.

## Architecture

The project follows a standard Next.js application structure, with the main pages and layouts located in the `app` directory and reusable components, hooks, and state management logic in the `src` directory.

### State Management

The application uses [Zustand](https://github.com/pmndrs/zustand) for state management. The Zustand stores are located in the `src/store` directory.

### 3D Graphics

The 3D graphics are rendered using [React Three Fiber](https://github.com/pmndrs/react-three-fiber), which is a React renderer for Three.js. The 3D components are located in the `src/components/canvas` directory.

## Real-time Communication

The application is intended to use WebSockets for real-time communication with the back-end server. The `socket.io-client` library is included as a dependency, and a custom hook, `useSocket`, is defined in `src/templates/hooks/useSocket.tsx` to manage the WebSocket connection.

### WebSocket Schema

The user requested documentation for a protobuf schema for the WebSockets. However, there is **no evidence of protobuf being used in this project**. The communication is likely done with JSON payloads over Socket.IO.

The `useSocket` hook is a generic hook that can be used to connect to any Socket.IO server. It takes a URI and a set of options as arguments and returns a socket instance.

## Missing Functionality

During the analysis of the codebase, the following missing functionality was identified:

*   **Chat:** The chat component in `src/components/dom/GamePage/Chat.tsx` is not connected to the WebSocket. The messages are currently hardcoded.
*   **Player Data:** The player list in `src/components/dom/GamePage/index.tsx` is hardcoded. This data should be received from the server via WebSockets.
*   **`useSocket` Hook:** The `useSocket` hook is not currently used in any of the components. This means that the application is not yet connecting to the WebSocket server.
*   **Protobuf:** As mentioned above, there is no protobuf implementation. If the back-end server uses protobuf, the front-end will need to be updated to handle it.
