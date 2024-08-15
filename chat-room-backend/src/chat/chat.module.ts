import { ChatHistoryModule } from './../chat-history/chat-history.module';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ChatHistoryModule, UserModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
