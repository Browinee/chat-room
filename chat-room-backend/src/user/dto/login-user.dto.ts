import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty({
        message: "username required"
    })
    username: string;

    @IsNotEmpty({
        message: 'password required'
    })
    password: string;
}
