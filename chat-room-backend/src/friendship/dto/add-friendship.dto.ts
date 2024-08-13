import { IsNotEmpty } from 'class-validator';

export class FriendshipAddDto {
  @IsNotEmpty({
    message: 'username is not empty',
  })
  username: string;

  reason: string;
}
