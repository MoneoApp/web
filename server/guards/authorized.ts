import { UserType } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';

import { Error } from '../../shared/constants';
import { Guard } from '../types';

export function authorized(...types: UserType[]): Guard {
  return (args, { user }) => {
    if (types.length ? !types.includes(user!.type) : !user) {
      throw new ApolloError('unauthorized', Error.Unauthorized);
    }
  };
}
