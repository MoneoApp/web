import { gql, useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDialoog } from 'dialoog';

import { UsersQuery } from '../../../apollo/UsersQuery';
import { InviteUser } from '../../../components/dialogs/InviteUser';
import { Button } from '../../../components/forms/Button';
import { FieldForm } from '../../../components/forms/FieldForm';
import { Input } from '../../../components/forms/Input';
import { Column } from '../../../components/layout/Column';
import { Row } from '../../../components/layout/Row';
import { Spinner } from '../../../components/Spinner';
import { Table } from '../../../components/users/Table';
import { roles } from '../../../constants';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { useSearch } from '../../../hooks/useSearch';
import { withBreakpoint } from '../../../utils/withBreakpoint';

const query = gql`
  query UsersQuery {
    users {
      id
      email
      role
      devices {
        id
      }
    }
  }
`;

export default function Users() {
  const skip = useAuthGuard();
  const { data } = useQuery<UsersQuery>(query, { skip });
  const [results, setSearch] = useSearch(data?.users, ['email']);
  const [, { open }] = useDialoog();

  return (
    <>
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
              <InviteUser {...props}/>
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
          href={(value) => `/admin/users/${value.id}`}
          columns={{
            email: { title: 'E-mail' },
            role: {
              title: 'Rol',
              size: '7.5rem',
              render: (value) => roles[value]
            },
            devices: {
              title: 'Apparaten',
              size: '7.5rem',
              render: (value) => value.length
            }
          }}
        />
      ) : (
        <Spinner/>
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
