import { ChatHistoryModule } from './../chat-history/chat-history.module';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [ChatHistoryModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
