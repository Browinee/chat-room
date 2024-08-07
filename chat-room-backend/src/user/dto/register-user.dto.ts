import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class RegisterUserDto {

    @IsNotEmpty({
        message: "validation.username_required"
    })
    username: string;

    @IsNotEmpty({
      message: "validation.nickName_required"
    })
    nickName: string;

    @IsNotEmpty({
      message: "validation.password_required"
    })
    @MinLength(6, {
      message: i18nValidationMessage('validation.password_min_length', {num: 6})
    })
    password: string;

    @IsNotEmpty({
        message: 'validation.email_required'
    })
    @IsEmail({}, {
        message: 'validation.email_format_invalid'
    })
    email: string;

    @IsNotEmpty({
        message: 'validation.captcha_required'
    })
    captcha: string;
}
