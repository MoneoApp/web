import { UserRole } from '@prisma/client';
import { FieldPath, FieldValues } from 'react-hook-form';

export type BadField<T extends FieldValues> = {
  path: FieldPath<T>,
  type: string
};

export type TokenData = {
  id: string,
  role: UserRole
};
