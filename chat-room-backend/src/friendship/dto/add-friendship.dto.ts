import { IsNotEmpty } from 'class-validator';

export class FriendshipAddDto {
  @IsNotEmpty({
    message: 'id is not required',
  })
  friendId: number;

  reason: string;
}
