import { ApolloError } from '@apollo/client';

import { useNotify } from '../hooks/useNotify';

export function handleError(notify: ReturnType<typeof useNotify>) {
  return (error: ApolloError) => {
    for (const e of error.graphQLErrors) {
      notify(e.extensions?.code ?? e.message);
    }
  };
}
