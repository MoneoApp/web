import { UserType } from '@prisma/client';

export enum Error {
  Unknown = 'UNKNOWN',
  Unauthorized = 'UNAUTHORIZED',
  BadUserInput = 'BAD_USER_INPUT',
  InvalidInvite = 'INVALID_INVITE',
  InvalidFileType = 'INVALID_FILE_TYPE',
  InvalidInteractions = 'INVALID_INTERACTIONS'
}

export const userElevation: Record<UserType, number> = {
  [UserType.USER]: 0,
  [UserType.CONTACT]: 1,
  [UserType.ADMIN]: 2
};
