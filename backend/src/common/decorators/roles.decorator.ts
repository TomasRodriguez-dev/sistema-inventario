import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../keys/public.key';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); 