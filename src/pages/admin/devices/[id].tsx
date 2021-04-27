import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { DeviceQuery, DeviceQueryVariables } from '../../../apollo/DeviceQuery';
import { useAuthGuard } from '../../../hooks/useAuthGuard';

const query = gql`
  query DeviceQuery($id: ID!) {
    device(id: $id) {
      id
      model
      brand
    }
  }
`;

export default function Device() {
  const skip = useAuthGuard();
  const { query: { id } } = useRouter();
  const { data } = useQuery<DeviceQuery, DeviceQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: {
      id: id as string
    }
  });

  return (
    <div>
      {data?.device?.model}
    </div>
  );
}
