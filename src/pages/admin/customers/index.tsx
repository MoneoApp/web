import { gql, useQuery } from '@apollo/client';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

import { ContactQuery, ContactQueryVariables } from '../../../apollo/ContactQuery';
import { CustomersQuery } from '../../../apollo/CustomersQuery';
import { UserType } from '../../../apollo/globalTypes';
import { Spinner } from '../../../components/Spinner';
import { ListActions } from '../../../components/users/ListActions';
import { Table } from '../../../components/users/Table';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { useSearch } from '../../../hooks/useSearch';
import { useAuthentication } from '../../../states/authentication';

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

const contactQuery = gql`
  query ContactQuery {
    me {
      id
      customer {
        id
      }
    }
  }
`;

export default function Customers() {
  const skip = useAuthGuard();
  const [{ type }] = useAuthentication();
  const { push } = useRouter();
  const { data } = useQuery<CustomersQuery>(query, {
    skip: skip || type === UserType.CONTACT
  });
  const [results, setSearch] = useSearch(data?.customers, ['name']);

  useQuery<ContactQuery>(contactQuery, {
    skip: skip || type === UserType.ADMIN,
    onCompleted: (contactData) => contactData.me && push(`/admin/customers/${contactData.me.customer.id}`)
  });

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
