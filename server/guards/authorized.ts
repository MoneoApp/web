import { ApolloError } from 'apollo-server-micro';

import { Error } from '../../shared/constants';
import { Guard } from '../types';

export function authorized(): Guard {
  return (args, { userId }) => {
    if (!userId) {
      throw new ApolloError('unauthorized', Error.Unauthorized);
    }
  };
}
