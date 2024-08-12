import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { RequireLogin, UserInfo } from 'src/common/decorators';
import { FriendshipAddDto } from './dto/add-friendship.dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @RequireLogin()
  @Get('request-list')
  async list(@UserInfo('userId') userId: number) {
    return this.friendshipService.list(userId);
  }

  @Post()
  @RequireLogin()
  async add(
    @Body() friendAddDto: FriendshipAddDto,
    @UserInfo('userId') userId: number,
  ) {
    return this.friendshipService.add(friendAddDto, userId);
  }

  @Put('/agree/:id')
  @RequireLogin()
  async agree(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!friendId) {
      throw new BadRequestException('id cannot be empty');
    }
    return this.friendshipService.agree(friendId, userId);
  }

  @Get('reject/:id')
  async reject(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!friendId) {
      throw new BadRequestException('id cannot be empty');
    }
    return this.friendshipService.reject(friendId, userId);
  }

  @Get('/list')
  @RequireLogin()
  async friendship(
    @UserInfo('userId') userId: number,
    @Query('name') name: string,
  ) {
    return this.friendshipService.getFriendship(userId, name);
  }

  @Delete('/remove/:id')
  @RequireLogin()
  async remove(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    return this.friendshipService.remove(friendId, userId);
  }
}
