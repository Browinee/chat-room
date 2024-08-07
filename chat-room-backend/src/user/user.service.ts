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
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const existedUser = await this.prisma.user.findUnique({
      where:{
        username: user.username
      }
    })
    if(existedUser){
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
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
