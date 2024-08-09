import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANON = 'allowAnon';

export const AllowAnon = () => SetMetadata(ALLOW_ANON, true);
