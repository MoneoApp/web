import { gql, useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useDialoog } from 'dialoog';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { CreateUser } from '../../../../shared/structs/CreateUser';
import { UsersQuery } from '../../../apollo/UsersQuery';
import { Dialog } from '../../../components/Dialog';
import { Button } from '../../../components/forms/Button';
import { FieldForm } from '../../../components/forms/FieldForm';
import { Form } from '../../../components/forms/Form';
import { Input } from '../../../components/forms/Input';
import { Column } from '../../../components/layout/Column';
import { Row } from '../../../components/layout/Row';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { withBreakpoint } from '../../../utils/withBreakpoint';

const query = gql`
  query UsersQuery {
    users {
      id
      email
      role
    }
  }
`;

export default function Users() {
  const skip = useAuthGuard();
  const { data } = useQuery<UsersQuery>(query, { skip });
  const fuse = useMemo(() => new Fuse(data?.users ?? [], {
    keys: ['email']
  }), [data]);
  const [search, setSearch] = useState('');
  const results = useMemo(() => search ? fuse.search(search) : data?.users.map((item) => ({
    item
  })), [fuse, search]);
  const [, { open }] = useDialoog();

  return (
    <div>
      <Row spacing={{ phone: 1 }}>
        <Column sizes={{ phone: 10 }}>
          <FieldForm name="search" onChange={setSearch}>
            <Input name="search" label="Zoeken"/>
          </FieldForm>
        </Column>
        <Column sizes={{ phone: 2 }}>
          <StyledAddButton
            text="Uitnodigen"
            onClick={open.c((props) => (
              <Dialog {...props}>
                <StyledDialogTitle>Nodig een gebruiker uit</StyledDialogTitle>
                <Form struct={CreateUser} onSubmit={console.log}>
                  <StyledFormContent>
                    <Input name="email" label="E-Mail" />
                    <StyledInviteButton text="Nodig uit"/>
                  </StyledFormContent>
                </Form>
              </Dialog>
            ))}
          >
            <StyledButtonText>Uitnodigen</StyledButtonText>
            +
          </StyledAddButton>
        </Column>
      </Row>
      {results?.map(({ item }) => (
        <Link key={item.id} href={`/admin/users/${item.id}`} passHref={true}>
          <StyledAnchor>
            <StyledRow>
              <Column sizes={{ phone: 11 }}>
                {item.email}
              </Column>
              <Column sizes={{ phone: 1 }}>
                &gt;
              </Column>
            </StyledRow>
          </StyledAnchor>
        </Link>
      ))}
    </div>
  );
}

const StyledAddButton = styled(Button)`
  height: calc(100% - 1rem);
`;

const StyledDialogTitle = styled.h2`
  font-weight: bold;
  margin-bottom: .75rem;
`;

const StyledFormContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInviteButton = styled(Button)`
  align-self: flex-end;
`;

const StyledButtonText = styled.span`
  display: none;

  ${withBreakpoint('laptop', css`
    display: inline-block;
  `)};
`;

const StyledAnchor = styled.a`
  text-decoration: none;
  outline: none;
  transition: box-shadow .25s ease;

  &:focus {
    box-shadow: 0 0 0 3px var(--yellow-300);
    z-index: 1;
  }

  &:hover {
    cursor: pointer;
  }
`;

const StyledRow = styled(Row)`
  background-color: var(--gray-100);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  color: var(--gray-500);
`;
