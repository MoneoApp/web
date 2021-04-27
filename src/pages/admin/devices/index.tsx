import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import Link from 'next/link';

import { DevicesQuery } from '../../../apollo/DevicesQuery';
import { Overview } from '../../../components/devices/Overview';
import { Column } from '../../../components/layout/Column';
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

  return (
    <>
      {data?.devices && (
        <Overview data={data.devices} keyBy="id" groupBy="brand">
          {(value) => (
            <Column sizes={{ phone: 3 }}>
              <Link href={`./devices/${value.id}`} passHref={true}>
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
