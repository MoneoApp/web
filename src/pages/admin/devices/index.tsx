import { gql, useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { DevicesQuery } from '../../../apollo/DevicesQuery';
import { Overview } from '../../../components/devices/Overview';
import { Button } from '../../../components/forms/Button';
import { FieldForm } from '../../../components/forms/FieldForm';
import { Input } from '../../../components/forms/Input';
import { Column } from '../../../components/layout/Column';
import { Row } from '../../../components/layout/Row';
import { Spinner } from '../../../components/Spinner';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { useSearch } from '../../../hooks/useSearch';
import { withBreakpoint } from '../../../utils/withBreakpoint';

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
      <Row spacing={{ phone: 1 }}>
        <Column sizes={{ phone: 9 }}>
          <FieldForm name="search" onChange={setSearch}>
            <Input name="search" label="Zoeken"/>
          </FieldForm>
        </Column>
        <Column sizes={{ phone: 3 }}>
          <Link href="/admin/devices/new" passHref={true}>
            <StyledButton as="a" text="Nieuw">
              <StyledButtonText>
                Nieuw
              </StyledButtonText>
              <FontAwesomeIcon icon={faPlus}/>
            </StyledButton>
          </Link>
        </Column>
      </Row>
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
