import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({
    message: 'Password cannot be empty',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;

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
    message: 'Username cannot be empty',
  })
  username: string;

  @IsNotEmpty({
    message: 'Captcha cannot be empty',
  })
  captcha: string;
}
