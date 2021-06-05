import { gql, useQuery } from '@apollo/client';

import { CustomersQuery } from '../../../apollo/CustomersQuery';
import { Spinner } from '../../../components/Spinner';
import { Table } from '../../../components/users/Table';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { useSearch } from '../../../hooks/useSearch';
import { ListActions } from '../../../components/users/ListActions';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { InviteUser } from '../../../components/dialogs/InviteUser';

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
  const [results, setSearch] = useSearch(data?.customers, ['name']);

  return (
    <>
      <ListActions
        text="Aanmaken"
        icon={faPlus}
        setSearch={setSearch}
      />
      {results ? (
        <Table
          data={results}
          keyBy="id"
          href={(value) => `/admin/customers/${value.id}`}
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
