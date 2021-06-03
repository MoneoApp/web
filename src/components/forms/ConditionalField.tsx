import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  name: string,
  check: (value: any) => boolean,
  children?: ReactNode
};

export function ConditionalField({ name, check, children }: Props) {
  const { watch } = useFormContext();

  const value = watch(name);

  return (
    <>
      {check(value) && children}
    </>
  );
}
