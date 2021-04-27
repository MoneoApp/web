import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';

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
              <StyledDevice>
                {value.model}
              </StyledDevice>
            </Column>
          )}
        </Overview>
      )}
    </>
  );
}

const StyledDevice = styled.button`
  margin: .5rem;
  padding: 1rem;
  background-color: var(--gray-300);
  border-radius: 8px;
  outline: none;
  transition: box-shadow .25s ease;

  &:focus {
    box-shadow: 0 0 0 3px var(--yellow-300);
    z-index: 1;
  }
`;


