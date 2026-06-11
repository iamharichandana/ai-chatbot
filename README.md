# NestJS AI Chatbot

A simple AI chatbot backend built with **NestJS** and **TypeScript**. It exposes REST APIs that let a user start a conversation, send messages, and receive AI-generated replies, with full conversation history kept per session.

## Features

- **Start a session** and get a unique `sessionId`.
- **Send a message** and receive an AI reply.
- **Retrieve the full conversation history** for a session.
- **Context awareness** — the entire conversation is sent to the AI on each request, so replies take earlier messages into account.
- **Works without an API key** — if no key is configured, the app runs in *mock mode* and returns a placeholder reply, so it can be run and tested without any external setup or cost.
- **Request validation** — invalid requests return clean `400` errors instead of crashing.

## Tech Stack

- **Node.js** (v18+)
- **NestJS** (controllers, services, modules, dependency injection)
- **TypeScript**
- **openai** SDK (also compatible with Google Gemini's OpenAI endpoint)
- **class-validator** / **class-transformer** for request validation
- **@nestjs/config** for environment variables

## Project Structure

```
src/
  chat/
    dto/
      create-message.dto.ts   # validates incoming message requests
    entities/
      message.entity.ts       # Message and Session type definitions
    chat.controller.ts        # HTTP layer (the 3 endpoints)
    chat.service.ts           # core chat logic
    chat.store.ts             # in-memory storage
    ai.service.ts             # talks to the AI model (with mock fallback)
    chat.module.ts            # wires the feature together
  app.module.ts
  main.ts
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in the values you want:

```bash
cp .env.example .env
```

See [Environment Variables](#environment-variables) below. You can leave the key empty to run in mock mode.

### 3. Run the app

```bash
npm run start:dev
```

The server starts on `http://localhost:3000`.


## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | No | API key for the AI provider. If empty, the app runs in **mock mode** (returns placeholder replies). |
| `OPENAI_BASE_URL` | No | Custom base URL. Set this to use Google Gemini's OpenAI-compatible endpoint. Leave empty for OpenAI. |
| `OPENAI_MODEL` | No | Model name. Defaults to `gpt-4o-mini`. Use `gemini-2.0-flash` for Gemini. |
| `PORT` | No | Port the server listens on. Defaults to `3000`. |

### Example: using Google Gemini (free tier)

Get a free key from [Google AI Studio](https://aistudio.google.com/apikey), then set:

```
OPENAI_API_KEY=your_gemini_key
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
OPENAI_MODEL=gemini-3.5-flash
```

### Example: using OpenAI

```
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
```

(Leave `OPENAI_BASE_URL` empty.)

## API Reference

Base path: `/api/chat`

### 1. Create a session

```
POST /api/chat/session
```

**Request**
```bash
curl -X POST http://localhost:3000/api/chat/session
```

**Response** `201`
```json
{ "sessionId": "3f9a1c2e-..." }
```

### 2. Send a message

```
POST /api/chat/message
```

**Body**
| Field | Type | Description |
|---|---|---|
| `sessionId` | string | The session ID returned from `/session`. |
| `message` | string | The user's message. |

**Request**
```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "3f9a1c2e-...", "message": "Hello, who are you?"}'
```

**Response** `201`
```json
{
  "sessionId": "3f9a1c2e-...",
  "reply": "Hello! I'm an AI assistant. How can I help you today?"
}
```

### 3. Get conversation history

```
GET /api/chat/history/:sessionId
```

**Request**
```bash
curl http://localhost:3000/api/chat/history/3f9a1c2e-...
```

**Response** `200`
```json
{
  "sessionId": "3f9a1c2e-...",
  "messages": [
    {
      "id": "a1b2-...",
      "sessionId": "3f9a1c2e-...",
      "role": "user",
      "content": "Hello, who are you?",
      "createdAt": "2025-06-11T10:00:00.000Z"
    },
    {
      "id": "a1b2....",
      "sessionId": "3f9a1c2e-...",
      "role": "assistant",
      "content": "Hello! I'm an AI assistant...",
      "createdAt": "2025-06-11T10:00:01.000Z"
    }
  ]
}
```

### Error responses

| Status | When |
|---|---|
| `400 Bad Request` | Missing or invalid fields (e.g. empty `message`), or unexpected fields. |
| `404 Not Found` | The `sessionId` does not exist. |

Example:
```bash
curl http://localhost:3000/api/chat/history/does-not-exist
# { "statusCode": 404, "message": "Session does-not-exist not found", "error": "Not Found" }
```

## Testing

```bash
npm test
```

Unit tests cover the chat service: session creation, message handling, and the 404 case for unknown sessions. The AI service is mocked in tests so no network calls are made.

## Assumptions & Limitations

- **Storage is in-memory.** No external database or cloud storage is connected, so chat history is not persisted and may be lost when the application session ends.
- **Mock mode** Without an API key, the application works in mock mode and generates sample responses rather than real AI responses.


