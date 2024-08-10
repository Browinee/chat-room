import { FriendshipAddDto } from './dto/add-friendship.dto';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(userId: number) {
    return this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId,
      },
    });
  }

  async add(friendAddDto: FriendshipAddDto, userId: number) {
    return await this.prismaService.friendRequest.create({
      data: {
        fromUserId: userId,
        toUserId: friendAddDto.friendId,
        reason: friendAddDto.reason,
        status: 0,
      },
    });
  }
}
