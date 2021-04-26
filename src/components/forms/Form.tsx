import { superstructResolver } from '@hookform/resolvers/superstruct';
import { ComponentPropsWithoutRef } from 'react';
import { DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { Struct } from 'superstruct';

import { useNotify } from '../../hooks/useNotify';
import { handleError } from '../../utils/handleError';

type Props<T> = {
  struct: Struct<T>,
  onSubmit: (data: T) => Promise<unknown>,
  values?: DefaultValues<T>
};

export function Form<T>({
  struct,
  onSubmit,
  values,
  ...props
}: Props<T> & Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'>) {
  const notify = useNotify();
  const form = useForm({
    resolver: superstructResolver(struct),
    defaultValues: values
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data as T).catch(handleError(notify, form)))}
        {...props}
      />
    </FormProvider>
  );
}
