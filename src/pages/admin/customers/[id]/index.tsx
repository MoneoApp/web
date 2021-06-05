import { gql, useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDialoog } from 'dialoog';
import { useRouter } from 'next/router';

import { CustomerQuery, CustomerQueryVariables } from '../../../../apollo/CustomerQuery';
import { InviteUser } from '../../../../components/dialogs/InviteUser';
import { Button } from '../../../../components/forms/Button';
import { FieldForm } from '../../../../components/forms/FieldForm';
import { Input } from '../../../../components/forms/Input';
import { Column } from '../../../../components/layout/Column';
import { Row } from '../../../../components/layout/Row';
import { Heading } from '../../../../components/navigation/Heading';
import { Spinner } from '../../../../components/Spinner';
import { Table } from '../../../../components/users/Table';
import { userTypes } from '../../../../constants';
import { useAuthGuard } from '../../../../hooks/useAuthGuard';
import { useSearch } from '../../../../hooks/useSearch';
import { withBreakpoint } from '../../../../utils/withBreakpoint';

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
      <Row spacing={{ phone: 1 }}>
        <Column sizes={{ phone: 9 }}>
          <FieldForm name="search" onChange={setSearch}>
            <Input name="search" label="Zoeken"/>
          </FieldForm>
        </Column>
        <Column sizes={{ phone: 3 }}>
          <StyledButton
            text="Uitnodigen"
            onClick={open.c((props) => (
              <InviteUser customerId={id as string} {...props}/>
            ))}
          >
            <StyledButtonText>Uitnodigen</StyledButtonText>
            <FontAwesomeIcon icon={faPlus}/>
          </StyledButton>
        </Column>
      </Row>
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
      {data?.customer?.devices && (
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
      )}
    </>
  );
}

const StyledButton = styled(Button)`
  height: calc(100% - 1rem);
`;

const StyledButtonText = styled.span`
  display: none;
  margin-right: .5rem;

  ${withBreakpoint('tabletLandscape', css`
    display: inline-block;
  `)};
`;
