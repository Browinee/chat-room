import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async createOneToOneChatroom(friendId: number, userId: number) {
    const { id } = await this.prismaService.chatroom.create({
      data: {
        name: 'chatroom' + Math.random().toString().slice(2, 8),
        type: false,
      },
      select: {
        id: true,
      },
    });

    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId: id,
      },
    });
    await this.prismaService.userChatroom.create({
      data: {
        userId: friendId,
        chatroomId: id,
      },
    });
    return 'One-to-one chatroom created successfully';
  }

  async createGroupChatroom(name: string, userId: number) {
    const { id } = await this.prismaService.chatroom.create({
      data: {
        name,
        type: true,
      },
    });
    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId: id,
      },
    });
    return 'Group chatroom created successfully';
  }

  async list(userId: number) {
    const chatroomIds = await this.prismaService.userChatroom.findMany({
      where: {
        userId,
      },
      select: {
        chatroomId: true,
      },
    });
    const chatrooms = await this.prismaService.chatroom.findMany({
      where: {
        id: {
          in: chatroomIds.map((item) => item.chatroomId),
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        createTime: true,
      },
    });
    const res = [];
    for (let i = 0; i < chatrooms.length; i++) {
      const userIds = await this.prismaService.userChatroom.findMany({
        where: {
          chatroomId: chatrooms[i].id,
        },
        select: {
          userId: true,
        },
      });
      res.push({
        ...chatrooms[i],
        userCount: userIds.length,
        userIds: userIds.map((item) => item.userId),
      });
    }

    return res;
  }

  async members(chatroomId: number) {
    const memberIds = await this.prismaService.userChatroom.findMany({
      where: {
        chatroomId,
      },
      select: {
        userId: true,
      },
    });
    const members = await this.prismaService.user.findMany({
      where: {
        id: {
          in: memberIds.map((item) => item.userId),
        },
      },
      select: {
        id: true,
        username: true,
        nickName: true,
        headPic: true,
        createTime: true,
        email: true,
      },
    });
    return members;
  }
  async info(chatroomId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    });
    const members = await this.members(chatroomId);
    return {
      ...chatroom,
      users: members,
    };
  }
  async join(chatroomId: number, joinUserId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    });

    if (chatroom.type === false) {
      throw new BadRequestException('one-to-one chatroom can not be joined');
    }
    const memebers = await this.members(chatroomId);
    const userIds = memebers.map((item) => item.id);
    if (userIds.includes(joinUserId)) {
      throw new BadRequestException('user already in chatroom');
    }

    await this.prismaService.userChatroom.create({
      data: {
        userId: joinUserId,
        chatroomId,
      },
    });
    return 'join success';
  }
  async quit(chatroomId: number, joinUserId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: {
        id: chatroomId,
      },
    });

    if (chatroom.type === false) {
      throw new BadRequestException('one-to-one chatroom can not be quit');
    }
    const memebers = await this.members(chatroomId);
    const userIds = memebers.map((item) => item.id);
    if (!userIds.includes(joinUserId)) {
      throw new BadRequestException('user already quit chatroom');
    }

    await this.prismaService.userChatroom.deleteMany({
      where: {
        userId: joinUserId,
        chatroomId,
      },
    });

    return `User: ${joinUserId} quit group room: ${chatroomId} success`;
  }
}
