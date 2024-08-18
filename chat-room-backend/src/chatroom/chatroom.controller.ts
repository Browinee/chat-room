import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { RequireLogin, UserInfo } from 'src/common/decorators';

@Controller('chatroom')
@RequireLogin()
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Post('create-one-to-one')
  async oneToOne(
    @Body('friendId') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!friendId) {
      throw new BadRequestException('friend id can not be empty');
    }
    return this.chatroomService.createOneToOneChatroom(friendId, userId);
  }

  @Post('create-group')
  async group(@Body('name') name: string, @UserInfo('userId') userId: number) {
    return this.chatroomService.createGroupChatroom(name, userId);
  }

  @Get('list')
  async list(@UserInfo('userId') userId: number, @Query('name') name: string) {
    if (!userId) {
      throw new BadRequestException('userId can not be empty');
    }
    return this.chatroomService.list(userId, name);
  }

  @Get('members')
  async members(@Query('chatroomId') chatroomId: number) {
    if (!chatroomId) {
      throw new BadRequestException('chatroomId can not be empty');
    }
    return this.chatroomService.members(chatroomId);
  }

  @Get('info/:id')
  async info(@Param('id') id: number) {
    if (!id) {
      throw new BadRequestException('chatroomId can not be empty');
    }
    return this.chatroomService.info(id);
  }

  @Get('join/:id')
  async join(
    @Param('id') id: number,
    @Query('joinUsername') joinUsername: string,
  ) {
    if (!id) {
      throw new BadRequestException('id can not be empty');
    }
    if (!joinUsername) {
      throw new BadRequestException('joinUsername can not be empty');
    }
    return this.chatroomService.join(id, joinUsername);
  }

  @Get('quit/:id')
  async quit(@Param('id') id: number, @Query('quitUserId') quitUserId: number) {
    if (!id) {
      throw new BadRequestException('id can not be empty');
    }
    if (!quitUserId) {
      throw new BadRequestException('quitUserId can not be empty');
    }
    return this.chatroomService.quit(id, quitUserId);
  }

  @Get('findChatroom')
  async findChatroom(
    @Query('userId1') userId1: string,
    @Query('userId2') userId2: string,
  ) {
    if (!userId1 || !userId2) {
      throw new BadRequestException('userId1 and userId2 can not be empty');
    }
    return this.chatroomService.queryOneToOneChatroom(+userId1, +userId2);
  }
}
