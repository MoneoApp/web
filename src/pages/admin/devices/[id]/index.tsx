import { gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDialoog } from 'dialoog';
import { useRouter } from 'next/router';

import { UpdateDevice } from '../../../../../shared/structs/UpdateDevice';
import { DeleteDeviceMutation, DeleteDeviceMutationVariables } from '../../../../apollo/DeleteDeviceMutation';
import { DeviceMutation, DeviceMutationVariables } from '../../../../apollo/DeviceMutation';
import { DeviceQuery, DeviceQueryVariables } from '../../../../apollo/DeviceQuery';
import { InteractionType } from '../../../../apollo/globalTypes';
import { Confirm } from '../../../../components/dialogs/Confirm';
import { PreviewQr } from '../../../../components/dialogs/ViewQr';
import { Editor } from '../../../../components/editor/Editor';
import { Button } from '../../../../components/forms/Button';
import { FileInput } from '../../../../components/forms/FileInput';
import { Form } from '../../../../components/forms/Form';
import { Input } from '../../../../components/forms/Input';
import { Column } from '../../../../components/layout/Column';
import { Row } from '../../../../components/layout/Row';
import { Heading } from '../../../../components/navigation/Heading';
import { Spinner } from '../../../../components/Spinner';
import { ListActions } from '../../../../components/users/ListActions';
import { Table } from '../../../../components/users/Table';
import { interactionFragment } from '../../../../fragments';
import { useAuthGuard } from '../../../../hooks/useAuthGuard';
import { useNotify } from '../../../../hooks/useNotify';
import { useSearch } from '../../../../hooks/useSearch';
import { getStaticAsset } from '../../../../utils/getStaticAsset';

const query = gql`
  query DeviceQuery($id: ID!) {
    device(id: $id) {
      id
      model
      brand
      type
      interactions {
        ...InteractionFragment
      }
      manuals {
        id
        title
        steps {
          id
        }
      }
    }
  }
  ${interactionFragment}
`;

const updateMutation = gql`
  mutation DeviceMutation($id: ID!, $model: String!, $brand: String!, $image: Upload, $interactions: [UpsertInteraction!]!) {
    updateDevice(id: $id, model: $model, brand: $brand, image: $image, interactions: $interactions) {
      id
      model
      brand
      type
      interactions {
        ...InteractionFragment
      }
    }
  }
  ${interactionFragment}
`;

const deleteMutation = gql`
  mutation DeleteDeviceMutation($id: ID!) {
    deleteDevice(id: $id) {
      id
    }
  }
`;

export default function Device() {
  const skip = useAuthGuard();
  const { push, query: { id } } = useRouter();
  const [, { open }] = useDialoog();
  const notify = useNotify();
  const { data } = useQuery<DeviceQuery, DeviceQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: { id: id as string }
  });
  const [mutateUpdate] = useMutation<DeviceMutation, DeviceMutationVariables>(updateMutation, {
    onCompleted: () => notify('Successvol apparaat bijgewerkt')
  });
  const [mutateDelete] = useMutation<DeleteDeviceMutation, DeleteDeviceMutationVariables>(deleteMutation, {
    onCompleted: () => push('/admin/devices').then(() => notify('Successvol apparaat verwijderd')),
    update: (cache) => cache.modify({
      fields: {
        devices: (devices: any[] = [], { readField }) => devices.filter((device) => readField('id', device) !== id)
      }
    })
  });
  const [results, setSearch] = useSearch(data?.device?.manuals, ['name']);

  return (
    <>
      <Heading text="Apparaat"/>
      {data?.device ? (
        <>
          <Form
            struct={UpdateDevice}
            values={{
              id: data.device.id,
              model: data.device.model,
              brand: data.device.brand,
              interactions: data.device.interactions.map(({ __typename, ...i }) => i)
            }}
            onSubmit={({ id: updateId, model, brand, image, interactions }) => mutateUpdate({
              variables: {
                id: updateId,
                model,
                brand,
                image,
                interactions: interactions.map(({ id: interactionId, ...i }) => ({
                  ...i,
                  id: interactionId![0] === 'L' ? undefined : interactionId,
                  type: i.type as InteractionType
                }))
              }
            })}
          >
            <Row>
              <Column sizes={{ phone: 12, laptop: 6 }}>
                <Input name="model" label="Model"/>
                <Input name="brand" label="Merk"/>
                <FileInput
                  name="image"
                  label="Productafbeelding"
                  accept="image/*"
                  default={getStaticAsset(data.device.id, 'full')}
                />
              </Column>
              <Column sizes={{ phone: 12 }}>
                <Editor
                  name="interactions"
                  image="image"
                  imageOverride={getStaticAsset(data.device.id, 'full')}
                  type="type"
                  typeOverride={data.device.type}
                />
                <StyledActions>
                  <Button
                    text="Verwijder"
                    type="button"
                    palette={['red-200', 'gray-0']}
                    onClick={open.c((props) => (
                      <Confirm
                        text="Weet je zeker dat je dit apparaat wil verwijderen?"
                        onConfirm={() => mutateDelete({
                          variables: { id: id as string }
                        })}
                        {...props}
                      />
                    ))}
                  />
                  <Button
                    text="Preview"
                    type="button"
                    palette={['gray-500', 'gray-200']}
                    onClick={open.c((props) => (
                      <PreviewQr
                        id={data!.device!.id}
                        {...props}
                      />
                    ))}
                  />
                  <Button text="Opslaan"/>
                </StyledActions>
              </Column>
            </Row>
          </Form>
          <Heading text="Handleidingen"/>
          <ListActions
            text="Aanmaken"
            icon={faPlus}
            setSearch={setSearch}
            href={`/admin/devices/${id}/manuals/new`}
          />
          <StyledTableWrapper>
            <Table
              data={results ?? []}
              keyBy="id"
              href={(value) => `/admin/devices/${id}/manuals/${value.id}`}
              columns={{
                title: { title: 'Titel' },
                steps: {
                  title: 'Stappen',
                  size: '7.5rem',
                  render: (value) => value.length
                }
              }}
            />
          </StyledTableWrapper>
        </>
      ) : (
        <Spinner text="Apparaat ophalen..."/>
      )}
    </>
  );
}

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

const StyledTableWrapper = styled.div`
  margin-bottom: 4rem;
`;
