import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
@Controller('api/chat') 
export class ChatController {
constructor(private readonly chatService: ChatService) {}
@Post('session')
createSession() {
return this.chatService.createSession();
}
@Post('message')
sendMessage(@Body() dto: CreateMessageDto) {
return this.chatService.sendMessage(dto.sessionId, dto.message);
}
@Get('history/:sessionId')
getHistory(@Param('sessionId') sessionId: string) {
return this.chatService.getHistory(sessionId);
}
}
