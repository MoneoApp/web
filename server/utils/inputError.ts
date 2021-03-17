import { ApolloError } from 'apollo-server-micro';
import { FieldValues } from 'react-hook-form';

import { Error } from '../../shared/constants';
import { BadField } from '../../shared/types';

export function inputError<T extends FieldValues>(fields: BadField<T>[]) {
  return new ApolloError('bad user input', Error.BadUserInput, { fields });
}
