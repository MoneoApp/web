import { UserType } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';

import { Error } from '../../shared/constants';
import { Guard } from '../types';

export function authorized(type?: UserType): Guard {
  return (args, { user }) => {
    if (type ? user?.role !== type : !user) {
      throw new ApolloError('unauthorized', Error.Unauthorized);
    }
  };
}
