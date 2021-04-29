import { ApolloError } from 'apollo-server-micro';

import { Error } from '../../shared/constants';
import { Guard } from '../types';

export function current(): Guard {
  return (args: any, { user }) => {
    if (user?.id !== args.userId ?? args.id) {
      throw new ApolloError('unauthorized', Error.Unauthorized);
    }
  };
}
