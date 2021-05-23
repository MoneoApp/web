import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { CreateManual } from '../../../../../../shared/structs/CreateManual';
import { InteractionType } from '../../../../../apollo/globalTypes';
import { NewManualQuery, NewManualQueryVariables } from '../../../../../apollo/NewManualQuery';
import { Form } from '../../../../../components/forms/Form';
import { Input } from '../../../../../components/forms/Input';
import { Column } from '../../../../../components/layout/Column';
import { Row } from '../../../../../components/layout/Row';
import { ManualSteps } from '../../../../../components/manuals/ManualSteps';
import { Heading } from '../../../../../components/navigation/Heading';
import { Spinner } from '../../../../../components/Spinner';
import { useAuthGuard } from '../../../../../hooks/useAuthGuard';

const query = gql`
  query NewManualQuery($id: ID!) {
    device(id: $id) {
      interactions {
        id
        title
        type
      }
    }
  }
`;

export default function NewManual() {
  const skip = useAuthGuard();
  const { query: { id } } = useRouter();
  const { data } = useQuery<NewManualQuery, NewManualQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: { id: id as string }
  });

  return (
    <>
      <Heading text="Nieuwe handleiding"/>
      {data?.device ? (
        <Form struct={CreateManual} values={{ deviceId: id as string }} onSubmit={console.log}>
          <Row>
            <Column sizes={{ phone: 12, laptop: 6 }}>
              <Input name="title" label="Titel"/>
            </Column>
          </Row>
          <ManualSteps
            name="steps"
            interactions={data.device.interactions.filter((interaction) => interaction.type !== InteractionType.ANCHOR)}
          />
        </Form>
      ) : (
        <Spinner text="Apparaat ophalen..."/>
      )}
    </>
  );
}
