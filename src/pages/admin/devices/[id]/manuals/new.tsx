import { gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

import { CreateManual } from '../../../../../../shared/structs/CreateManual';
import { InteractionType } from '../../../../../apollo/globalTypes';
import { NewManualMutation, NewManualMutationVariables } from '../../../../../apollo/NewManualMutation';
import { NewManualQuery, NewManualQueryVariables } from '../../../../../apollo/NewManualQuery';
import { Button } from '../../../../../components/forms/Button';
import { Form } from '../../../../../components/forms/Form';
import { Input } from '../../../../../components/forms/Input';
import { Column } from '../../../../../components/layout/Column';
import { Row } from '../../../../../components/layout/Row';
import { ManualSteps } from '../../../../../components/manuals/ManualSteps';
import { Heading } from '../../../../../components/navigation/Heading';
import { Spinner } from '../../../../../components/Spinner';
import { interactionFragment } from '../../../../../fragments';
import { useAuthGuard } from '../../../../../hooks/useAuthGuard';

const query = gql`
  query NewManualQuery($id: ID!) {
    device(id: $id) {
      id
      interactions {
        ...InteractionFragment
      }
    }
  }
  ${interactionFragment}
`;

const mutation = gql`
  mutation NewManualMutation($deviceId: ID!, $title: String!, $steps: [UpsertManualStep!]!) {
    createManual(deviceId: $deviceId, title: $title, steps: $steps) {
      id
      title
      steps {
        id
      }
    }
  }
`;

export default function NewManual() {
  const skip = useAuthGuard();
  const { push, query: { id } } = useRouter();
  const { data } = useQuery<NewManualQuery, NewManualQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: { id: id as string }
  });
  const [mutate] = useMutation<NewManualMutation, NewManualMutationVariables>(mutation, {
    onCompleted: () => push(`/admin/devices/${id}`),
    update: (cache, { data: d }) => d?.createManual && cache.modify({
      id: `Device:${id}`,
      fields: {
        manuals: (manuals: any[] = []) => [
          ...manuals,
          d.createManual
        ]
      }
    })
  });

  return (
    <>
      <Heading text="Nieuwe handleiding"/>
      {data?.device ? (
        <Form
          struct={CreateManual}
          values={{ deviceId: id as string }}
          onSubmit={(variables) => mutate({ variables })}
        >
          <Row>
            <Column sizes={{ phone: 12, laptop: 6 }}>
              <Input name="title" label="Titel"/>
            </Column>
          </Row>
          <ManualSteps
            name="steps"
            id={data.device.id}
            interactions={data.device.interactions.filter((interaction) => interaction.type !== InteractionType.ANCHOR)}
          />
          <StyledActions>
            <Button text="Opslaan"/>
          </StyledActions>
        </Form>
      ) : (
        <Spinner text="Apparaat ophalen..."/>
      )}
    </>
  );
}

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;
