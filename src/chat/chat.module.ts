import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatStore } from './chat.store';
import { AiService } from './ai.service';
@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatStore, AiService], 
})
export class ChatModule {}
