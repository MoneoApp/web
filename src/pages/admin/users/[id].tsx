import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { UserQuery, UserQueryVariables } from '../../../apollo/UserQuery';
import { useAuthGuard } from '../../../hooks/useAuthGuard';

const query = gql`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      email
      role
    }
  }
`;

export default function User() {
  const skip = useAuthGuard();
  const { query: { id } } = useRouter();
  const { data } = useQuery<UserQuery, UserQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: { id: id as string }
  });

  return (
    <div>
      {data?.user?.email}
    </div>
  );
};
