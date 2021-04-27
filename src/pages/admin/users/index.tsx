import { gql, useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDialoog } from 'dialoog';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { UsersQuery } from '../../../apollo/UsersQuery';
import { InviteUser } from '../../../components/dialogs/InviteUser';
import { Button } from '../../../components/forms/Button';
import { FieldForm } from '../../../components/forms/FieldForm';
import { Input } from '../../../components/forms/Input';
import { Column } from '../../../components/layout/Column';
import { Row } from '../../../components/layout/Row';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { withBreakpoint } from '../../../utils/withBreakpoint';
import { useSearch } from '../../../hooks/useSearch';

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
      {results?.map((user) => (
        <Link key={user.id} href={`/admin/users/${user.id}`} passHref={true}>
          <StyledAnchor>
            {user.email}
            <FontAwesomeIcon icon={faChevronRight}/>
          </StyledAnchor>
        </Link>
      ))}
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

const StyledAnchor = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: .75rem 1rem;
  color: var(--gray-500);
  background-color: var(--gray-200);
  border-radius: 8px;
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
