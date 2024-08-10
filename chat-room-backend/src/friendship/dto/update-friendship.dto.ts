import { PartialType } from '@nestjs/mapped-types';
import { FriendshipAddDto } from './add-friendship.dto';

export class UpdateFriendshipDto extends PartialType(FriendshipAddDto) {}
