import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { UpdateManual } from '../../../../../../shared/structs/UpdateManual';
import { InteractionType } from '../../../../../apollo/globalTypes';
import { ManualQuery, ManualQueryVariables } from '../../../../../apollo/ManualQuery';
import { Form } from '../../../../../components/forms/Form';
import { Input } from '../../../../../components/forms/Input';
import { Column } from '../../../../../components/layout/Column';
import { Row } from '../../../../../components/layout/Row';
import { ManualSteps } from '../../../../../components/manuals/ManualSteps';
import { Heading } from '../../../../../components/navigation/Heading';
import { Spinner } from '../../../../../components/Spinner';
import { useAuthGuard } from '../../../../../hooks/useAuthGuard';

const query = gql`
  query ManualQuery($id: ID!) {
    manual(id: $id) {
      id
      title
      steps {
        text
        order
        interactions {
          id
        }
      }
      device {
        interactions {
          id
          title
          type
        }
      }
    }
  }
`;

export default function Manual() {
  const skip = useAuthGuard();
  const { query: { manualId } } = useRouter();
  const { data } = useQuery<ManualQuery, ManualQueryVariables>(query, {
    skip: skip || typeof manualId !== 'string',
    variables: { id: manualId as string }
  });

  return (
    <>
      <Heading text="Handleiding"/>
      {data?.manual ? (
        <Form
          struct={UpdateManual}
          values={{
            id: data.manual.id,
            title: data.manual.title,
            steps: [...data.manual.steps].sort((a, b) => a.order - b.order).map((step) => ({
              text: step.text,
              interactionIds: step.interactions.map(({ id }) => id)
            }))
          }}
          onSubmit={console.log}
        >
          <Row>
            <Column sizes={{ phone: 12, laptop: 6 }}>
              <Input name="title" label="Titel"/>
            </Column>
          </Row>
          <ManualSteps
            name="steps"
            interactions={data.manual.device.interactions.filter((interaction) => interaction.type !== InteractionType.ANCHOR)}
          />
        </Form>
      ) : (
        <Spinner text="Handleiding ophalen..."/>
      )}
    </>
  );
}
