import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterUserDto {

    @IsNotEmpty({
        message: "required"
    })
    username: string;

    @IsNotEmpty({
        message: 'required'
    })
    nickName: string;

    @IsNotEmpty({
        message: 'required'
    })
    @MinLength(6, {
        message: 'no less than 6 '
    })
    password: string;

    @IsNotEmpty({
        message: 'required'
    })
    @IsEmail({}, {
        message: 'not valid'
    })
    email: string;

    @IsNotEmpty({
        message: 'required'
    })
    captcha: string;
}
