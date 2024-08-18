import { RequireLogin, UserInfo } from './../common/decorators';
import { Delete, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
@RequireLogin()
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  async list(@UserInfo('userId') userId: number) {
    return this.favoriteService.list(userId);
  }

  @Post()
  async add(
    @UserInfo('userId') userId: number,
    @Body('chatHistoryId') chatHistoryId: number,
  ) {
    return this.favoriteService.add(userId, chatHistoryId);
  }

  @Delete()
  async del(@Query('id') id: number) {
    return this.favoriteService.del(id);
  }
}
