import {
  BadRequestException,
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
    @Query('friendId') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!friendId) {
      throw new BadRequestException('friend id can not be empty');
    }
    return this.chatroomService.createOneToOneChatroom(friendId, userId);
  }

  @Post('create-group')
  async group(@Query('name') name: string, @UserInfo('userId') userId: number) {
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
  async join(@Param('id') id: number, @Query('joinUserId') joinUserId: number) {
    if (!id) {
      throw new BadRequestException('id can not be empty');
    }
    if (!joinUserId) {
      throw new BadRequestException('joinUserId can not be empty');
    }
    return this.chatroomService.join(id, joinUserId);
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
}
