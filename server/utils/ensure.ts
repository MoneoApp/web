import { ApolloError } from 'apollo-server-micro';
import { Error } from '../../shared/constants';

export async function ensure<T>(promise: Promise<T | null>) {
  const value = await promise;

  if (!value) {
    throw new ApolloError('unknown', Error.Unknown);
  }

  return value;
}
