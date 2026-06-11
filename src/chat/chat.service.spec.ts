import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatStore } from './chat.store';
import { AiService } from './ai.service';
describe('ChatService', () => {
let service: ChatService;
beforeEach(async () => {
const moduleRef = await Test.createTestingModule({
      providers: [
ChatService,
ChatStore,
{ provide: AiService, useValue: { generateReply: async () => 'fake reply' } }
],
}).compile();
    service = moduleRef.get(ChatService);
});
it('creates a session with an id', () => {
const result = service.createSession();
expect(result.sessionId).toBeDefined();
});
it('replies to a message in an existing session', async () => {
const { sessionId } = service.createSession();
const result = await service.sendMessage(sessionId, 'hi');
expect(result.reply).toBe('fake reply');
});
it('throws 404 for an unknown session', () => {
expect(() => service.getHistory('nope')).toThrow(NotFoundException);
});
});