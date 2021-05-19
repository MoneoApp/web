import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { ManualQuery, ManualQueryVariables } from '../../../../../apollo/ManualQuery';
import { Column } from '../../../../../components/layout/Column';
import { Row } from '../../../../../components/layout/Row';
import { Heading } from '../../../../../components/navigation/Heading';
import { Spinner } from '../../../../../components/Spinner';
import { useAuthGuard } from '../../../../../hooks/useAuthGuard';

const query = gql`
  query ManualQuery($id: ID!) {
    manual(id: $id) {
      id
      title
    }
  }
`;

export default function Manual() {
  const skip = useAuthGuard();
  const { query: { id } } = useRouter();
  const { data } = useQuery<ManualQuery, ManualQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: { id: id as string }
  });

  return (
    <>
      <Heading text="Handleiding"/>
      {data?.manual ? (
        <>
          <Row>
            <Column sizes={{ phone: 12, laptop: 6 }}>
              <h1>{data.manual.title}</h1>
            </Column>
          </Row>
        </>
      ) : (
        <Spinner text="Handleiding ophalen..."/>
      )}
    </>
  );
}
