import { ReactNode, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type Props = {
  name: string,
  value?: string,
  onChange: (value: string) => void,
  children?: ReactNode
};

export function FieldForm({ name, value, onChange, children }: Props) {
  const form = useForm({
    defaultValues: {
      [name]: value
    }
  });
  const values = form.watch();
  const changeRef = useRef(onChange);

  changeRef.current = onChange;

  useEffect(() => {
    const v = values[name as any];

    if (v) {
      changeRef.current?.(v);
    }
  }, [value, values]);

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}
