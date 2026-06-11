import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Message, Session, Role } from './entities/message.entity';
@Injectable() 
export class ChatStore {
private sessions = new Map<string, Session>();
private messages = new Map<string, Message[]>();
createSession(): Session {
const session: Session = { id: randomUUID(), createdAt: new Date() };
this.sessions.set(session.id, session);
this.messages.set(session.id, []);
return session;
}
sessionExists(sessionId: string): boolean {
return this.sessions.has(sessionId);
}
addMessage(sessionId: string, role: Role, content: string): Message {
const message: Message = {
      id: randomUUID(),
      sessionId,
      role,
      content,
      createdAt: new Date(),
};
this.messages.get(sessionId)!.push(message);
return message;
}
getHistory(sessionId: string): Message[] {
return this.messages.get(sessionId) ?? [];
}
}