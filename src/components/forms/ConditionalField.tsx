import { ReactNode, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  name: string,
  check: (value: any) => boolean,
  children?: ReactNode
};

export function ConditionalField({ name, check, children }: Props) {
  const { watch, formState: { isSubmitting } } = useFormContext();
  const [value, setValue] = useState<any>();

  const watched = watch(name);

  useEffect(() => {
    if (!isSubmitting) {
      setValue(watched);
    }
  }, [watched, isSubmitting, setValue]);

  return (
    <>
      {check(value) && children}
    </>
  );
}
