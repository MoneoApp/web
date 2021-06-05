import { gql, useQuery } from '@apollo/client';

import { CustomersQuery } from '../../../apollo/CustomersQuery';
import { Spinner } from '../../../components/Spinner';
import { Table } from '../../../components/users/Table';
import { useAuthGuard } from '../../../hooks/useAuthGuard';

const query = gql`
  query CustomersQuery {
    customers {
      id
      name
      users {
        id
      }
      devices {
        id
      }
    }
  }
`;

export default function Customers() {
  const skip = useAuthGuard();
  const { data } = useQuery<CustomersQuery>(query, { skip });

  return (
    <>
      {data ? (
        <Table
          data={data.customers}
          keyBy="id"
          href={(value) => `/admin/users/${value.id}`}
          columns={{
            name: { title: 'Naam' },
            users: {
              title: 'Gebruikers',
              size: '7.5rem',
              render: (value) => value.length
            },
            devices: {
              title: 'Apparaten',
              size: '7.5rem',
              render: (value) => value.length
            }
          }}
        />
      ) : (
        <Spinner text="Klanten ophalen..."/>
      )}
    </>
  );
}
