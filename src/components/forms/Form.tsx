import { superstructResolver } from '@hookform/resolvers/superstruct';
import { ComponentPropsWithoutRef } from 'react';
import { DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { Struct } from 'superstruct';

import { useNotify } from '../../hooks/useNotify';
import { handleError } from '../../utils/handleError';

type Props<T> = {
  struct?: Struct<T>,
  values?: DefaultValues<T>,
  onSubmit: (data: T) => unknown | Promise<unknown>
};

export function Form<T>({
  struct,
  values,
  onSubmit,
  ...props
}: Props<T> & Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'>) {
  const notify = useNotify();
  const form = useForm({
    resolver: struct && superstructResolver(struct),
    defaultValues: values
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((data) => Promise.resolve(onSubmit(data as T)).catch(handleError(notify, form)))}
        {...props}
      />
    </FormProvider>
  );
}
