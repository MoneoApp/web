import { FieldPath, FieldValues } from 'react-hook-form';

export type BadField<T extends FieldValues> = {
  path: FieldPath<T>,
  type: string
};
