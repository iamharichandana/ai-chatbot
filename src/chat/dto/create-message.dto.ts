import { IsString, IsNotEmpty } from 'class-validator';
export class CreateMessageDto {
@IsString()
@IsNotEmpty()
  sessionId: string;
@IsString()
@IsNotEmpty()
  message: string;
}