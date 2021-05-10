import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { faEye, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

import { CreateDevice } from '../../../../shared/structs/CreateDevice';
import { DeviceType } from '../../../apollo/globalTypes';
import { NewDeviceMutation, NewDeviceMutationVariables } from '../../../apollo/NewDeviceMutation';
import { BigRadio } from '../../../components/forms/BigRadio';
import { Button } from '../../../components/forms/Button';
import { FileInput } from '../../../components/forms/FileInput';
import { Form } from '../../../components/forms/Form';
import { Input } from '../../../components/forms/Input';
import { Column } from '../../../components/layout/Column';
import { Row } from '../../../components/layout/Row';
import { Heading } from '../../../components/navigation/Heading';
import { useAuthGuard } from '../../../hooks/useAuthGuard';

const mutation = gql`
  mutation NewDeviceMutation($model: String!, $brand: String!, $type: DeviceType!) {
    createDevice(model: $model, brand: $brand, type: $type) {
      id
      model
      brand
    }
  }
`;

export default function NewDevice() {
  const { push } = useRouter();
  const [mutate] = useMutation<NewDeviceMutation, NewDeviceMutationVariables>(mutation, {
    onCompleted: () => push('/admin/devices'),
    update: (cache, { data }) => data?.createDevice && cache.modify({
      fields: {
        devices: (devices: any[] = []) => [
          ...devices,
          data.createDevice
        ]
      }
    })
  });

  useAuthGuard();

  return (
    <>
      <Heading text="Nieuw apparaat"/>
      <Row>
        <Column sizes={{ phone: 12, laptop: 6 }}>
          <Form
            struct={CreateDevice}
            onSubmit={({ model, brand, type }) => mutate({
              variables: {
                model,
                brand,
                type: type as DeviceType
              }
            })}
          >
            <Input name="model" label="Model"/>
            <Input name="brand" label="Merk"/>
            <FileInput name="image" label="Productafbeelding" accept="image/*"/>
            <BigRadio
              name="type"
              label="Detectietype"
              options={[{
                value: DeviceType.STATIC,
                icon: faQrcode,
                description: 'Gebruik een QR code als een startpunt voor de overlay. Vaak gebruikt voor stilstaande apparaten.',
                color: 'red-100'
              }, {
                value: DeviceType.DYNAMIC,
                icon: faEye,
                description: 'Gebruik \'Machine Learning\' om het model en startpunt te herkennen. Vaak gebruikt voor mobiele apparaten.',
                color: 'green-100'
              }]}
            />
            <StyledActions>
              <Button text="Aanmaken"/>
            </StyledActions>
          </Form>
        </Column>
      </Row>
    </>
  );
}

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;
