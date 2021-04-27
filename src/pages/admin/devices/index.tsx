import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { DevicesQuery } from '../../../apollo/DevicesQuery';
import { Overview } from '../../../components/devices/Overview';
import { Button } from '../../../components/forms/Button';
import { FieldForm } from '../../../components/forms/FieldForm';
import { Input } from '../../../components/forms/Input';
import { Column } from '../../../components/layout/Column';
import { Row } from '../../../components/layout/Row';
import { useAuthGuard } from '../../../hooks/useAuthGuard';

const query = gql`
  query DevicesQuery {
    devices {
      id
      model
      brand
    }
  }
`;

export default function Devices() {
  const skip = useAuthGuard();
  const { data } = useQuery<DevicesQuery>(query, { skip });
  const fuse = useMemo(() => new Fuse(data?.devices ?? [], {
    keys: ['model', 'brand'],
    shouldSort: false
  }), [data]);
  const [search, setSearch] = useState('');
  const results = useMemo(() => !search ? data?.devices : fuse.search(search).map(({ item }) => item), [fuse, search]);

  return (
    <>
      <Row spacing={{ phone: 1 }}>
        <Column sizes={{ phone: 10 }}>
          <FieldForm name="search" onChange={setSearch}>
            <Input name="search" label="Zoeken"/>
          </FieldForm>
        </Column>
        <Column sizes={{ phone: 2 }}>
          <Link href="/admin/devices/new" passHref={true}>
            <StyledButton as="a" text="Nieuw"/>
          </Link>
        </Column>
      </Row>
      {results && (
        <Overview data={results} keyBy="id" groupBy="brand">
          {(value) => (
            <Column sizes={{ phone: 3 }}>
              <Link href={`/admin/devices/${value.id}`} passHref={true}>
                <StyledDevice>
                  {value.model}
                </StyledDevice>
              </Link>
            </Column>
          )}
        </Overview>
      )}
    </>
  );
}

const StyledButton = styled(Button)`
  height: calc(100% - 1rem);
`;

const StyledDevice = styled.a`
  margin: .5rem;
  padding: 1rem;
  color: var(--gray-500);
  background-color: var(--gray-300);
  border-radius: 8px;
  outline: none;
  text-decoration: none;
  transition: box-shadow .25s ease;

  &:focus {
    box-shadow: 0 0 0 3px var(--yellow-300);
    z-index: 1;
  }
`;
