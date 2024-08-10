import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
