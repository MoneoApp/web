import { UserRole } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';

import { Error } from '../../shared/constants';
import { Guard } from '../types';

export function authorized(role?: UserRole): Guard {
  return (args, { user }) => {
    if (role ? user?.role !== role : !user) {
      throw new ApolloError('unauthorized', Error.Unauthorized);
    }
  };
}
