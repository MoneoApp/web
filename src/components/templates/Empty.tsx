import { ReactNode } from 'react';

type Props = {
  children?: ReactNode
};

export function Empty({ children }: Props) {
  return (
    <main>
      {children}
    </main>
  );
}
