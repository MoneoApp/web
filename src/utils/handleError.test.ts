import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

import { handleError } from './handleError';

function createError(...messages: { message: string, code?: string }[]) {
  return new ApolloError({
    graphQLErrors: messages.map(({ message, code }) => new GraphQLError(
      message,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { code }
    ))
  });
}

it('should call notify', () => {
  const notify = jest.fn();
  const message = 'Test';

  handleError(notify)(createError({ message }));

  expect(notify).toBeCalledWith(message);
});

it('should iterate over all errors', () => {
  const notify = jest.fn();

  handleError(notify)(createError({ message: 'Test 1' }, { message: 'Test 2' }));

  expect(notify).toBeCalledTimes(2);
});

it('should use the error code if available', () => {
  const notify = jest.fn();
  const code = 'CODE';

  handleError(notify)(createError({ message: 'Test', code }));

  expect(notify).toBeCalledWith(code);
});
