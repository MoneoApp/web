import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuthentication } from '../states/authentication';

export function useAuthGuard() {
  const { push } = useRouter();
  const [{ token }] = useAuthentication();
  const skip = process.browser && !token;

  useEffect(() => {
    if (skip) {
      void push('/');
    }
  }, [skip, push]);

  return skip;
}
