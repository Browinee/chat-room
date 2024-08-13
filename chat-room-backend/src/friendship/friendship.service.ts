import { FriendshipAddDto } from './dto/add-friendship.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FriendRequestStatus, User } from '@prisma/client';
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
    const friend = await this.prismaService.user.findUnique({
      where: {
        username: friendAddDto.username,
      },
    });
    if (!friend) {
      throw new BadRequestException(`${friendAddDto.username} is not exist`);
    }
    if (friend.id === userId) {
      throw new BadRequestException('cannot add self as friend');
    }
    const found = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId: friend.id,
      },
    });
    if (found.length) {
      throw new BadRequestException(
        `${friendAddDto.username} is already friend`,
      );
    }

    return await this.prismaService.friendRequest.create({
      data: {
        fromUserId: userId,
        toUserId: friend.id,
        reason: friendAddDto.reason,
        status: FriendRequestStatus.PENDING,
      },
    });
  }

  async agree(friendId: number, userId: number) {
    console.log('friend', { friendId, userId });

    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: userId,
        toUserId: friendId,
        status: FriendRequestStatus.PENDING,
      },
      data: {
        status: FriendRequestStatus.ACCEPTED,
      },
    });

    const res = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId,
      },
    });

    if (!res.length) {
      await this.prismaService.friendship.create({
        data: {
          userId,
          friendId,
        },
      });
    }
    return '添加成功';
  }

  async reject(friendId: number, userId: number) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: FriendRequestStatus.PENDING,
      },
      data: {
        status: FriendRequestStatus.REJECTED,
      },
    });
    return 'Declined';
  }

  async getFriendship(userId: number, name: string) {
    const friends = await this.prismaService.friendship.findMany({
      where: {
        OR: [
          {
            userId: userId,
          },
          {
            friendId: userId,
          },
        ],
      },
    });
    console.log('friends', friends);

    const set = new Set<number>();
    for (let i = 0; i < friends.length; i++) {
      set.add(friends[i].userId);
      set.add(friends[i].friendId);
    }

    const friendIds = [...set].filter((item) => item !== userId);

    const res = [];

    for (let i = 0; i < friendIds.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: friendIds[i],
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true,
        },
      });
      res.push(user);
    }

    return name
      ? res.filter((item: User) => item.nickName.includes(name))
      : res;
  }

  async remove(friendId: number, userId: number) {
    await this.prismaService.friendship.deleteMany({
      where: {
        userId,
        friendId,
      },
    });
    return '删除成功';
  }
}
