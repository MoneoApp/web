import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Heading } from '../components/navigation/Heading';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useAuthentication } from '../states/authentication';

export default function Logout() {
  const { cache } = useApolloClient();
  const [, { logout }] = useAuthentication();
  const { push } = useRouter();

  useAuthGuard();

  useEffect(() => {
    cache.reset()
      .then(logout)
      .then(() => push('/'));
  }, []);

  return (
    <Heading text="Uitloggen"/>
  );
}
