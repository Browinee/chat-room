import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { ChatMessageType } from '@prisma/client';
import { UserService } from 'src/user/user.service';

interface JoinRoomPayload {
  chatroomId: number;
  userId: number;
}

interface SendMessagePayload {
  sendUserId: number;
  chatroomId: number;
  message: {
    type: ChatMessageType;
    content: string;
  };
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer() server: Server;
  @Inject(UserService)
  private userService: UserService;

  @Inject(ChatHistoryService)
  private chatHistoryService: ChatHistoryService;

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: JoinRoomPayload): void {
    const roomName = payload.chatroomId.toString();

    client.join(roomName);

    this.server.to(roomName).emit('message', {
      type: 'joinRoom',
      userId: payload.userId,
    });
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() payload: SendMessagePayload) {
    const roomName = payload.chatroomId.toString();

    const history = await this.chatHistoryService.add(payload.chatroomId, {
      content: payload.message.content,
      type:
        payload.message.type === ChatMessageType.IMAGE
          ? ChatMessageType.IMAGE
          : ChatMessageType.TEXT,
      chatroomId: payload.chatroomId,
      senderId: payload.sendUserId,
    });
    console.log('history------------------', history);
    const sender = await this.userService.findUserDetailById(
      payload.sendUserId,
    );
    this.server.to(roomName).emit('message', {
      type: 'sendMessage',
      userId: payload.sendUserId,
      message: {
        ...history,
        sender,
      },
    });
  }
}
