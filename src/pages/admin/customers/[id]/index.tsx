import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDialoog } from 'dialoog';
import { useRouter } from 'next/router';

import { CustomerQuery, CustomerQueryVariables } from '../../../../apollo/CustomerQuery';
import { InviteUser } from '../../../../components/dialogs/InviteUser';
import { Heading } from '../../../../components/navigation/Heading';
import { Spinner } from '../../../../components/Spinner';
import { ListActions } from '../../../../components/users/ListActions';
import { Table } from '../../../../components/users/Table';
import { userTypes } from '../../../../constants';
import { useAuthGuard } from '../../../../hooks/useAuthGuard';
import { useSearch } from '../../../../hooks/useSearch';
import { useAuthentication } from '../../../../states/authentication';
import { UserType } from '../../../../apollo/globalTypes';

const query = gql`
  query CustomerQuery($id: ID!) {
    customer(id: $id) {
      id
      users {
        id
        email
        type
      }
      devices {
        id
        model
        brand
      }
    }
  }
`;

export default function Customer() {
  const { query: { id } } = useRouter();
  const [{ type }] = useAuthentication();
  const skip = useAuthGuard();
  const { data } = useQuery<CustomerQuery, CustomerQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: { id: id as string }
  });
  const [results, setSearch] = useSearch(data?.customer?.users, ['email']);
  const [, { open }] = useDialoog();

  return (
    <>
      <Heading text="Gebruikers"/>
      <ListActions
        text="Uitnodigen"
        icon={faPlus}
        onClick={open.c((props) => (
          <InviteUser customerId={id as string} {...props}/>
        ))}
        setSearch={setSearch}
      />
      {results ? (
        <Table
          data={results}
          keyBy="id"
          href={(value) => `/admin/customers/${id}/${value.id}`}
          columns={{
            email: { title: 'E-mail' },
            type: {
              title: 'Rol',
              size: '10rem',
              render: (value) => userTypes[value]
            }
          }}
        />
      ) : (
        <Spinner text="Gebruikers ophalen..."/>
      )}
      {type === UserType.ADMIN && data?.customer?.devices && (
        <StyledTable>
          <Table
            data={data.customer.devices}
            keyBy="id"
            href={(value) => `/admin/devices/${value.id}`}
            columns={{
              model: { title: 'Model' },
              brand: {
                title: 'Merk',
                size: '10rem'
              }
            }}
          />
        </StyledTable>
      )}
    </>
  );
}

const StyledTable = styled.div`
  margin-top: 4rem;
`;
