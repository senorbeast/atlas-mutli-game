# Implementation Plan

This document outlines the plan to implement the missing real-time functionality in the Atlas Multi-Game front-end, based on the architecture of the `atlas-backend`.

## 1. Protobuf Schema Updates (Backend & Frontend)

First, the protobuf schemas must be updated to support the full game logic.

-   **Action:**
    1.  In `atlas-backend/internal/protobufs/assets/game_message_payload.proto`:
        -   Add `repeated PlayerData players = 5;` to `GameStatePayload`.
        -   Add `string current_player_id = 6;` to `GameStatePayload`.
        -   Add `string value = 3;` to `GameUpdatePayload` to carry the submitted word.
    2.  In `atlas-backend/internal/protobufs/assets/client_server_message.proto`:
        -   Add a new message type: `SET_PLAYER_DETAILS = 3;`
        -   Add a new payload to the `oneof` statement: `PlayerData player_data_payload = 5;`
    3.  In `atlas-backend/internal/protobufs/assets/server_client_message.proto`:
        -   Add `PlayerData player_data_payload = 6;` to the `payload` oneof in `ServerToClientMessage`.
    4.  Regenerate the protobuf Go code in the backend.
    5.  Copy the updated `.proto` files to the frontend project (`src/protobufs`).
    6.  Set up a script in the frontend to generate JavaScript classes from the `.proto` files using a library like `protobufjs`.

## 2. WebSocket API and State Management (Frontend)

With the updated schema, the frontend can be set up to handle the WebSocket API.

-   **Action:**
    1.  Create Zustand slices:
        -   `socketSlice.ts`: To manage the WebSocket connection, `RoomID`, and `PlayerID`.
        -   `gameSlice.ts`: To manage game state, including the player list, current turn, and game status.
        -   `chatSlice.ts`: To manage chat messages.
    2.  Implement the WebSocket connection flow:
        -   On game entry, prompt the user for a name.
        -   Send an HTTP request to the backend's `/create` endpoint to get a `RoomID`.
        -   Use this `RoomID` to connect to the WebSocket.
        -   On receiving the `SEND_ON_CONNECT_ACK` message, store the `PlayerID` and `RoomID` in the `socketSlice`.
        -   Send a `SET_PLAYER_DETAILS` message with the player's chosen name.
        -   After connecting, send a `REQUEST_GAME_STATE` message.

## 3. Feature Implementation (Frontend)

Implement the UI and logic for the multiplayer game and chat.

### Lobby and Player Management
-   **Listen for `BROADCAST_GAME_UPDATE` with `type: "PLAYER_JOINED"` and `type: "PLAYER_LEFT"`**: Update the player list in `gameSlice`.
-   **Listen for `RESPOND_GAME_STATE`**: Populate the initial game state and player list in `gameSlice`.

### Game Logic
-   **Implement "Start Game" button**: When clicked, send a `SEND_GAME_UPDATE` message with `type: "START_GAME"`.
-   **Listen for `BROADCAST_GAME_UPDATE` with `type: "GAME_STARTED"`**: Update the UI to show the game has begun.
-   **Listen for `BROADCAST_GAME_UPDATE` with `type: "NEW_TURN"`**: Highlight the current player and start a turn timer in the UI.
-   **Implement Word Submission**:
    -   When a player submits a word, send a `SEND_GAME_UPDATE` message with `type: "SUBMIT_WORD"` and the word in the `value` field.
-   **Listen for `BROADCAST_GAME_UPDATE` with `type: "WORD_ACCEPTED"` or `type: "WORD_REJECTED"`**: Show feedback to the user.
-   **Listen for `BROADCAST_GAME_UPDATE` with `type: "PLAYER_UPDATE"`**: Update the relevant player's score or hearts.
-   **Listen for `BROADCAST_GAME_UPDATE` with `type: "GAME_OVER"`**: Display the game over screen and the winner.

### Chat
-   **Implement Chat Input**: On message submission, send a `SEND_CHAT_MESSAGE` with the player's ID and the message content.
-   **Listen for `BROADCAST_CHAT_MESSAGE`**: Add the incoming message to the `chatSlice` and display it in the chat window.