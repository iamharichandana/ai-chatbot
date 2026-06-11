# THOUGHT_PROCESS

This document explains how I approached the assignment, the decisions I made, the challenges I ran into, and where I used AI assistance.

## How I approached it

I started by breaking the assignment down into the four functional requirements and confirming what each endpoint needed to do before writing any code:

1. `POST /api/chat/session` — create a new_session, return a unique_sessionID.
2. `POST /api/chat/message` — accept a message, return an AI reply.
3. `GET /api/chat/history/:sessionId` — return the conversation.
4. Persist messages.

## Architectural decisions

**Separation of concerns into four pieces.** I split the chat feature into four classes to keep the code organized and maintainable instead of putting everything in one service.
- `ChatController` — this only handles HTTP no logic is included here (taking the request, returning the response). 
- `ChatService` — the actual logic (saving messages, calling the AI). 
- `ChatStore` — all chat storage saved here.
- `AiService` — keeps all AI-related logic in one place, making the code easier to manage.

**In-memory storage.** The assignment allowed in-memory, JSON, or SQLite. I chose in-memory because it satisfies the requirement, has zero setup, and keeps the focus on the parts being evaluated (API design, NestJS structure, error handling). Because storage is hidden behind `ChatStore`, upgrading to SQLite later would be a contained change rather than a rewrite. I documented the trade-off (data lost on restart).

**Mock fallback in the AI service.** I designed `AiService` so that if no API key is configured, it returns a placeholder reply instead of failing. When a real key is provided, the same code path calls the actual model.

**Provider flexibility.** I used the OpenAI SDK but exposed `OPENAI_BASE_URL` and `OPENAI_MODEL` as environment variables. Because Google Gemini offers an OpenAI-compatible endpoint, the same code works with either provider just by changing config — no code changes needed.

**Validation via DTO + global pipe.** I used a `CreateMessageDto` with `class-validator` decorators and enabled NestJS's `ValidationPipe` globally. This rejects malformed requests with a clean `400` before they ever reach my logic, which keeps the service code focused on the happy path and the error handling consistent.

## Challenges

- **Understanding dependency injection.** The biggest challenge I faced was learning how dependency injection works in NestJS. Initially, I expected to create services using new, but later I understood that NestJS handles it automatically.
- **Testing without a real API.** I provided a temparary `AiService` in the test module, which let me test the chat logic in isolation and made the tests fast and reliable.
- **Error handling consistency.** I made sure both the message and history endpoints check that the session exists and throw `NotFoundException`, so the API behaves predictably for invalid input.

## Where I used AI assistance

AI tools were allowed for this assignment, and I used them. To be transparent about exactly how:

- I used an AI assistant to **explain NestJS concepts** for getting more clear information of — modules, controllers, services, and dependency injection — and to help me build a sample model of how they fit together.
- I used it to **help scaffold the initial structure** and suggest a clean way to segregate the storage and AI layers to confusions.

In every case I went through the suggestions, made sure I understood why each piece was there, and adjusted the code to fit my idealogy. I treated the AI as a tutor and a pair-programmer rather than something to copy from blindly — I wanted to be able to explain every line of the project, which I can.