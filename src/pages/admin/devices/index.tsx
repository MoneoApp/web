import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

import { DevicesQuery } from '../../../apollo/DevicesQuery';
import { Overview } from '../../../components/devices/Overview';
import { Column } from '../../../components/layout/Column';
import { Spinner } from '../../../components/Spinner';
import { ListActions } from '../../../components/users/ListActions';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { useSearch } from '../../../hooks/useSearch';

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
  const [results, setSearch] = useSearch(data?.devices, ['model', 'brand']);

  return (
    <>
      <ListActions
        text="Nieuw"
        icon={faPlus}
        href="/admin/devices/new"
        setSearch={setSearch}
      />
      {results ? (
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
      ) : (
        <Spinner text="Apparaten ophalen..."/>
      )}
    </>
  );
}

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
