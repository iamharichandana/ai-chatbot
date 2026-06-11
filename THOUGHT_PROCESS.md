# THOUGHT_PROCESS

This document explains how I approached the assignment, the decisions I made, the challenges I ran into, and where I used AI assistance.

## How I approached it

I started by breaking the assignment down into the four functional requirements and confirming what each endpoint needed to do before writing any code:

1. `POST /api/chat/session` — create a session, return a sessionID.
2. `POST /api/chat/message` — accept a message, return an AI reply.
3. `GET /api/chat/history/:sessionId` — return the conversation.
4. Persist messages.

My priority was to get a clean, working version of all four requirements first, commit it, and only then add bonus features. I wanted to avoid the trap of starting something ambitious (like streaming) and running out of time with nothing complete.

## Architectural decisions

**Separation of concerns into four pieces.** I deliberately split the chat feature into four classes rather than putting everything in one service:

- `ChatController` — only handles HTTP (parsing the request, returning the response). It contains no logic.
- `ChatService` — the core logic: it orchestrates saving messages, fetching history, and asking the AI for a reply.
- `ChatStore` — all storage lives here.
- `AiService` — all communication with the AI provider lives here.

The reasoning: each class has one responsibility, which makes the code easier to read and test. It also means storage and the AI provider are isolated. If I wanted to switch from in-memory storage to SQLite, I'd only touch `ChatStore`. If I wanted to switch AI providers, I'd only touch `AiService`. Nothing else would change.

**In-memory storage.** The assignment allowed in-memory, JSON, or SQLite. I chose in-memory because it satisfies the requirement, has zero setup, and keeps the focus on the parts being evaluated (API design, NestJS structure, error handling). Because storage is hidden behind `ChatStore`, upgrading to SQLite later would be a contained change rather than a rewrite. I documented the trade-off (data lost on restart) honestly in the README.

**Mock fallback in the AI service.** I designed `AiService` so that if no API key is configured, it returns a placeholder reply instead of failing. This means the project runs and can be tested without anyone needing to set up or pay for an API account, which I felt was important for the person grading it. When a real key is provided, the same code path calls the actual model.

**Provider flexibility.** I used the OpenAI SDK but exposed `OPENAI_BASE_URL` and `OPENAI_MODEL` as environment variables. Because Google Gemini offers an OpenAI-compatible endpoint, the same code works with either provider just by changing config — no code changes needed. This was useful since Gemini has a free tier.

**Context awareness.** When handling a message, the service saves the user's message, then passes the *entire* conversation history to the AI rather than just the latest message. This gives context awareness within a session for free, since the AI sees everything said so far.

**Validation via DTO + global pipe.** I used a `CreateMessageDto` with `class-validator` decorators and enabled NestJS's `ValidationPipe` globally. This rejects malformed requests with a clean `400` before they ever reach my logic, which keeps the service code focused on the happy path and the error handling consistent.

## Challenges

- **Understanding dependency injection.** Coming in with little NestJS experience, the biggest hurdle was understanding why services are listed in the constructor and registered in the module rather than created with `new`. Once I understood that NestJS creates and injects them for me, the structure made sense and writing tests became much easier.
- **Matching the AI message format.** My internal `Message` type and the format the AI SDK expects are slightly different, so I had to map between them in the AI service. I also hit a TypeScript strictness issue around the message role types and resolved it by typing the mapped array explicitly.
- **Testing without a real API.** I didn't want my unit tests to make real network calls. I solved this by providing a fake `AiService` in the test module, which let me test the chat logic in isolation and made the tests fast and reliable.
- **Error handling consistency.** I made sure both the message and history endpoints check that the session exists and throw `NotFoundException`, so the API behaves predictably for invalid input.

## Where I used AI assistance

AI tools were allowed for this assignment, and I used them. To be transparent about exactly how:

- I used an AI assistant to **explain NestJS concepts** I hadn't used before — modules, controllers, services, and dependency injection — and to help me build a mental model of how they fit together.
- I used it to **help scaffold the initial structure** and suggest a clean way to separate the storage and AI layers.
- I used it to **explain the OpenAI SDK usage** and the Gemini-compatible endpoint option.

In every case I read through the suggestions, made sure I understood why each piece was there, and adjusted the code to fit my own structure and naming. I treated the AI as a tutor and a pair-programmer rather than something to copy from blindly — I wanted to be able to explain every line of the project, which I can.

## What I'd improve with more time

- **Persistent storage with SQLite** (via TypeORM), so conversations survive restarts.
- **Full SSE streaming** so replies stream token-by-token instead of arriving all at once.
- **Authentication / session ownership**, so users can only access their own sessions.
- **Rate limiting and input size limits** to protect the AI endpoint from abuse.
- **More test coverage**, including end-to-end tests of the HTTP endpoints, not just the service.
- **Structured logging and error monitoring** for production readiness.