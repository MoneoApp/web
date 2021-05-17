import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { OverlayQuery, OverlayQueryVariables } from '../../../../../apollo/OverlayQuery';
import { Column } from '../../../../../components/layout/Column';
import { Row } from '../../../../../components/layout/Row';
import { Heading } from '../../../../../components/navigation/Heading';
import { Spinner } from '../../../../../components/Spinner';
import { useAuthGuard } from '../../../../../hooks/useAuthGuard';

const query = gql`
  query OverlayQuery($id: ID!) {
    overlay(id: $id) {
      id
      name
    }
  }
`;

export default function Overlay() {
  const skip = useAuthGuard();
  const { query: { id } } = useRouter();
  const { data } = useQuery<OverlayQuery, OverlayQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: { id: id as string }
  });

  return (
    <>
      <Heading text="Handleiding"/>
      {data?.overlay ? (
        <>
          <Row>
            <Column sizes={{ phone: 12, laptop: 6 }}>
              <h1>{data.overlay.name}</h1>
            </Column>
          </Row>
        </>
      ) : (
        <Spinner text="Handleiding ophalen..."/>
      )}
    </>
  );
}
