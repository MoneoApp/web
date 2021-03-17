import { superstructResolver } from '@hookform/resolvers/superstruct';
import { ComponentPropsWithoutRef } from 'react';
import { DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { Struct } from 'superstruct';

type Props<T> = {
  struct: Struct<T>,
  onSubmit: (data: T) => void,
  values?: DefaultValues<T>
};

export function Form<T>({ struct, onSubmit, values, ...props }: Props<T> & Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'>) {
  const form = useForm({
    resolver: superstructResolver(struct),
    defaultValues: values
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data as T))} {...props}/>
    </FormProvider>
  );
}
