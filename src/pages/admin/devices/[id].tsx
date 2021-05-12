import { gql, useMutation, useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDialoog } from 'dialoog';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DeleteDeviceMutation, DeleteDeviceMutationVariables } from '../../../apollo/DeleteDeviceMutation';
import { DeviceMutation, DeviceMutationVariables } from '../../../apollo/DeviceMutation';
import { DeviceQuery, DeviceQueryVariables } from '../../../apollo/DeviceQuery';
import { Confirm } from '../../../components/dialogs/Confirm';
import { Button } from '../../../components/forms/Button';
import { FieldForm } from '../../../components/forms/FieldForm';
import { Form } from '../../../components/forms/Form';
import { Input } from '../../../components/forms/Input';
import { Column } from '../../../components/layout/Column';
import { Row } from '../../../components/layout/Row';
import { Heading } from '../../../components/navigation/Heading';
import { Spinner } from '../../../components/Spinner';
import { Table } from '../../../components/users/Table';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { useNotify } from '../../../hooks/useNotify';
import { useSearch } from '../../../hooks/useSearch';
import { withBreakpoint } from '../../../utils/withBreakpoint';

const query = gql`
  query DeviceQuery($id: ID!) {
    device(id: $id) {
      id
      model
      brand
      overlays {
        id
        name
        interactions {
          id
        }
      }
    }
  }
`;

const updateMutation = gql`
  mutation DeviceMutation($id: ID!, $model: String!, $brand: String!) {
    updateDevice(id: $id, model: $model, brand: $brand) {
      id
      model
      brand
    }
  }
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
  const [results, setSearch] = useSearch(data?.device?.overlays, ['name']);

  return (
    <>
      <Heading text="Apparaat"/>
      {data?.device ? (
        <>
          <Row>
            <Column sizes={{ phone: 12, laptop: 6 }}>
              <Form
                values={{
                  id: data.device.id,
                  model: data.device.model,
                  brand: data.device.brand
                }}
                onSubmit={(variables) => mutateUpdate({ variables })}
              >
                <Input name="model" label="Model"/>
                <Input name="brand" label="Merk"/>
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
                  <Button text="Opslaan"/>
                </StyledActions>
              </Form>
            </Column>
          </Row>
          <Row spacing={{ phone: 1 }}>
            <Column sizes={{ phone: 9 }}>
              <FieldForm name="search" onChange={setSearch}>
                <Input name="search" label="Zoeken"/>
              </FieldForm>
            </Column>
            <Column sizes={{ phone: 3 }}>
              <Link href="/admin/overlays/new" passHref={true}>
                <StyledButton as="a" text="Nieuw">
                  <StyledButtonText>
                    Nieuw
                  </StyledButtonText>
                  <FontAwesomeIcon icon={faPlus}/>
                </StyledButton>
              </Link>
            </Column>
          </Row>
          <Table
            data={results ?? []}
            keyBy="id"
            href={(value) => `/admin/overlays/${value.id}`}
            columns={{
              name: { title: 'Naam' },
              interactions: {
                title: 'Stappen',
                size: '7.5rem',
                render: (value) => value.length
              }
            }}
          />
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
  margin-bottom: 1rem;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

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
