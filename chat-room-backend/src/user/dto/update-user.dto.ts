import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  headPic: string;

  nickName: string;

  @IsNotEmpty({
    message: 'Email cannot be empty',
  })
  @IsEmail(
    {},
    {
      message: 'Invalid email format',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'Captcha cannot be empty',
  })
  captcha: string;
}
