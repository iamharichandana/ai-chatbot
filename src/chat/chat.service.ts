import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatStore } from './chat.store';
import { AiService } from './ai.service';
@Injectable()
export class ChatService {
constructor(
private readonly store: ChatStore,
private readonly ai: AiService,
) {}
createSession() {
const session = this.store.createSession();
return { sessionId: session.id };
}
async sendMessage(sessionId: string, userMessage: string) {
if (!this.store.sessionExists(sessionId)) {
throw new NotFoundException(`Session ${sessionId} not found`);
}
this.store.addMessage(sessionId, 'user', userMessage);
const history = this.store.getHistory(sessionId);
const reply = await this.ai.generateReply(history);
const assistantMessage = this.store.addMessage(sessionId, 'assistant', reply);
return { sessionId, reply: assistantMessage.content };
}
getHistory(sessionId: string) {
if (!this.store.sessionExists(sessionId)) {
throw new NotFoundException(`Session ${sessionId} not found`);
}
return { sessionId, messages: this.store.getHistory(sessionId)};
}
}
