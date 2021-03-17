import { ApolloError } from '@apollo/client';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import { Error } from '../../shared/constants';
import { BadField } from '../../shared/types';
import { useNotify } from '../hooks/useNotify';

export function handleError<T extends FieldValues>(notify: ReturnType<typeof useNotify>, form?: UseFormReturn<T>) {
  return (error: ApolloError) => {
    form?.clearErrors();

    for (const e of error.graphQLErrors) {
      const code = e.extensions?.code;

      notify(code ?? e.message);

      if (!form || code !== Error.BadUserInput) {
        continue;
      }

      const fields = e.extensions!.fields as BadField<T>[];

      for (const field of fields) {
        form.setError(field.path, {
          type: field.type
        });
      }
    }
  };
}
