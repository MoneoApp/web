import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuthentication } from '../states/authentication';

export function useAuthGuard(authenticated = true, target = '/') {
  const { push } = useRouter();
  const [{ token }] = useAuthentication();
  const skip = process.browser && (Boolean(token) !== authenticated);

  useEffect(() => {
    if (skip) {
      void push(target);
    }
  }, [skip, push, target]);

  return skip;
}
