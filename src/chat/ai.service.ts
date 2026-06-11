import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { Message } from './entities/message.entity';
@Injectable()
export class AiService {
private readonly logger = new Logger(AiService.name);
private client: OpenAI | null = null;
constructor() {
const apiKey = process.env.OPENAI_API_KEY;
if (apiKey) {
this.client = new OpenAI({
apiKey,
baseURL: process.env.OPENAI_BASE_URL || undefined,
});
} else {
this.logger.warn('No OPENAI_API_KEY found — running in MOCK mode.');
}
}
async generateReply(history: Message[]): Promise<string> {
if (!this.client) {
const last = history[history.length- 1]?.content ?? '';
return `(mock mode) You said: "${last}". Set OPENAI_API_KEY for real AI replies`;
}
const messages = history.map((m) => ({
role: m.role as 'user' | 'assistant',
content: m.content,
}));
const completion = await this.client.chat.completions.create({
model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
messages: [
{ role: 'system', content: 'You are a helpful, concise assistant.' },
...messages,
],
});
return completion.choices[0]?.message?.content ?? '(no response)';
}
}

