import { RegisterUserDto } from './dto/register-user.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;
  @Inject(RedisService)
  private redisService: RedisService;

  private logger = new Logger();

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);
    if (!captcha) {
      throw new HttpException('captcha is overdue', HttpStatus.BAD_REQUEST);
    }
    if (user.captcha !== captcha) {
      throw new HttpException('captcha is not correct', HttpStatus.BAD_REQUEST);
    }
    const existedUser = await this.prisma.user.findUnique({
      where:{
        username: user.username
      }
    })
    if(existedUser){
      throw new HttpException('user existed', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.prisma.user.create({
        data: {
          username: user.username,
          password: user.password,
          nickName: user.nickName,
          email: user.email
        },
        select: {
          id: true,
          username: true,
          nickName: true,
          email: true,
          headPic: true,
          createTime: true
        }
      });
    } catch(e) {
      this.logger.error(e, UserService);
      return null;
    }
  }
  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
      select: {
        id: true,
      },
    });
  }
}
