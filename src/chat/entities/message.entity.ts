export type Role = 'user' | 'assistant';
export interface Message {
  id: string;
  sessionId: string;
  role: Role;
  content: string;
  createdAt: Date;
}
export interface Session {
  id: string;
  createdAt: Date;
}