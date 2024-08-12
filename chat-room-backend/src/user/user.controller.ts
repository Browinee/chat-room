import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UserService } from './user.service';
import { RequireLogin, UserInfo } from 'src/common/decorators';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('邮箱地址不能为空');
    }
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    // await this.emailService.sendMail({
    //   to: address,
    //   subject: '注册验证码',
    //   html: `<p>你的注册验证码是 ${code}</p>`
    // });
    return `Your register captcha is ${code}`;
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);
    return {
      user,
      token: this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
        },
        {
          expiresIn: '7d',
        },
      ),
    };
  }

  @Get('')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return this.userService.findUserDetailById(userId);
  }

  @Put()
  @RequireLogin()
  async updateInfo(
    @UserInfo('userId') userId: number,
    @UserInfo('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, email, updateUserDto);
  }

  @Post('update_password')
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return this.userService.updatePassword(passwordDto);
  }
  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('email is required');
    }
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_password_captcha_${address}`,
      code,
      10 * 60,
    );

    // await this.emailService.sendMail({
    //   to: address,
    //   subject: '',
    //   html: `<p> ${code}</p>`,
    // });
    return `Your update password captcha is ${code}`;
  }
  @Get('captcha')
  async getCaptcha(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('email is required');
    }
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`update_user_${address}`, code, 10 * 60);

    // await this.emailService.sendMail({
    //   to: address,
    //   subject: '',
    //   html: `<p> ${code}</p>`,
    // });
    return '发送成功';
  }

  @Get('update/captcha')
  @RequireLogin()
  async updateCaptcha(@UserInfo('userId') userId: number) {
    const { email: address } = await this.userService.findUserDetailById(
      userId,
    );

    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_user_captcha_${address}`,
      code,
      10 * 60,
    );

    // await this.emailService.sendMail({
    //   to: address,
    //   subject: '',
    //   html: `<p> ${code}</p>`,
    // });
    return `Your update user info captcha is ${code}`;
  }
}
