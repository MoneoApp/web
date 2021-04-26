import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import Fuse from 'fuse.js';
import Link from 'next/link'
import { useMemo, useState } from 'react';

import { Search } from '../../../shared/structs/Search';
import { UsersQuery } from '../../apollo/UsersQuery';
import { Button } from '../../components/forms/Button';
import { Form } from '../../components/forms/Form';
import { Input } from '../../components/forms/Input';
import { Column } from '../../components/layout/Column';
import { Row } from '../../components/layout/Row';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function Users() {
  useAuthGuard();

  const users = gql`
    query UsersQuery {
      users {
        id
        email
        role
      }
    }
  `;
  const { data } = useQuery<UsersQuery>(users);

  // @ts-ignore
  const fuse = useMemo(() => new Fuse(data?.users, {
    keys: ['email']
  }), [data?.users])
  const [search, setSearch] = useState('');
  const results = useMemo(() => search ? fuse.search(search, { limit: 1 }) : data?.users.map((item) => ({
    item
  })), [fuse, search]);

  return (
    <div>
      <Form
        struct={Search}
        onSubmit={(e) => Promise.resolve()}
      >
        <Row>
          <Column sizes={{ phone: 10 }}>
            <Input name="search" label="Zoeken" onChange={(e) => setSearch(e.target.value)}/>
          </Column>
          <Column sizes={{ phone: 2 }}>
            <StyledButton text="Nieuw">
              <span>Nieuw</span>
              <StyledIcon>+</StyledIcon>
            </StyledButton>
          </Column>
        </Row>
      </Form>
      <>
        {// @ts-ignore
          results?.map(({ item }) => (
          <Link key={item.id} href={`./users/${item.id}`}>
            <StyledAnchor>
              <StyledRow>
                <Column sizes={{ phone: 11}}>
                  {item.email}
                </Column>
                <Column sizes={{ phone: 1}}>
                  {'>'}
                </Column>
              </StyledRow>
            </StyledAnchor>
          </Link>
        ))}
      </>
    </div>
  );
}

const StyledButton = styled(Button)`
  height: 100%;
  margin-left: 0.25rem;
  margin-bottom: 1rem;
`;

const StyledIcon = styled.span`
  margin-left: 0.5rem;
`;

const StyledAnchor = styled.a`
  text-decoration: none;
`

const StyledRow = styled(Row)`
  background-color: var(--grey-100);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  color: var(--grey-500);

  &:hover {
    cursor: pointer;
  }

  &:active {
    background-color: var(--grey-200);
  }
`;
