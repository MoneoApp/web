import { gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { useDialoog } from 'dialoog';
import { useRouter } from 'next/router';

import { UpdateManual } from '../../../../../../shared/structs/UpdateManual';
import { DeleteManualMutation, DeleteManualMutationVariables } from '../../../../../apollo/DeleteManualMutation';
import { InteractionType } from '../../../../../apollo/globalTypes';
import { ManualMutation, ManualMutationVariables } from '../../../../../apollo/ManualMutation';
import { ManualQuery, ManualQueryVariables } from '../../../../../apollo/ManualQuery';
import { Confirm } from '../../../../../components/dialogs/Confirm';
import { Button } from '../../../../../components/forms/Button';
import { Form } from '../../../../../components/forms/Form';
import { Input } from '../../../../../components/forms/Input';
import { Column } from '../../../../../components/layout/Column';
import { Row } from '../../../../../components/layout/Row';
import { ManualSteps } from '../../../../../components/manuals/ManualSteps';
import { Heading } from '../../../../../components/navigation/Heading';
import { Spinner } from '../../../../../components/Spinner';
import { colors } from '../../../../../constants';
import { useAuthGuard } from '../../../../../hooks/useAuthGuard';
import { useNotify } from '../../../../../hooks/useNotify';

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
          color
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

const updateMutation = gql`
  mutation ManualMutation($id: ID!, $title: String!, $steps: [UpsertManualStep!]!) {
    updateManual(id: $id, title: $title, steps: $steps) {
      id
      title
      steps {
        id
      }
    }
  }
`;

const deleteMutation = gql`
  mutation DeleteManualMutation($id: ID!) {
    deleteManual(id: $id) {
      id
    }
  }
`;

export default function Manual() {
  const skip = useAuthGuard();
  const notify = useNotify();
  const { push, query: { id, manualId } } = useRouter();
  const [, { open }] = useDialoog();
  const { data } = useQuery<ManualQuery, ManualQueryVariables>(query, {
    skip: skip || typeof manualId !== 'string',
    variables: { id: manualId as string }
  });
  const [mutateUpdate] = useMutation<ManualMutation, ManualMutationVariables>(updateMutation, {
    onCompleted: () => notify('Successvol handleiding bijgewerkt')
  });
  const [mutateDelete] = useMutation<DeleteManualMutation, DeleteManualMutationVariables>(deleteMutation, {
    onCompleted: () => push(`/admin/devices/${id}`).then(() => notify('Successvol handleiding verwijderd')),
    update: (cache) => cache.modify({
      id: `Device:${id}`,
      fields: {
        devices: (devices: any[] = [], { readField }) => devices.filter((device) => readField('id', device) !== id)
      }
    })
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
              interactions: step.interactions.map((interaction) => ({
                id: interaction.id,
                color: interaction.color ?? colors.yellow['200']![0]
              }))
            }))
          }}
          onSubmit={(variables) => mutateUpdate({ variables })}
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
          <StyledActions>
            <Button
              text="Verwijder"
              type="button"
              palette={['red-200', 'gray-0']}
              onClick={open.c((props) => (
                <Confirm
                  text="Weet je zeker dat je dize handleiding wil verwijderen?"
                  onConfirm={() => mutateDelete({
                    variables: { id: manualId as string }
                  })}
                  {...props}
                />
              ))}
            />
            <Button text="Opslaan"/>
          </StyledActions>
        </Form>
      ) : (
        <Spinner text="Handleiding ophalen..."/>
      )}
    </>
  );
}

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;
