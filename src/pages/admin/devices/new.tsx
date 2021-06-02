import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { faEye, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { CreateDevice } from '../../../../shared/structs/CreateDevice';
import { DeviceType, InteractionType } from '../../../apollo/globalTypes';
import { NewDeviceMutation, NewDeviceMutationVariables } from '../../../apollo/NewDeviceMutation';
import { Editor } from '../../../components/editor/Editor';
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
  mutation NewDeviceMutation($model: String!, $brand: String!, $image: Upload!, $type: DeviceType!, $mlImages: Upload!, $interactions: [UpsertInteraction!]!) {
    createDevice(model: $model, brand: $brand, image: $image, type: $type, mlImages: $mlImages, interactions: $interactions) {
      id
      model
      brand
    }
  }
`;

export default function NewDevice() {
  const { push } = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [mutate] = useMutation<NewDeviceMutation, NewDeviceMutationVariables>(mutation, {
    context: {
      fetchOptions: {
        onProgress: (ev: ProgressEvent) => {
          setProgress((ev.loaded / ev.total) * 100);
        }
      }
    },
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
      <Form
        struct={CreateDevice}
        onSubmit={({ model, brand, image, type, mlImages, interactions }) => mutate({
          variables: {
            model,
            brand,
            image,
            type: type as DeviceType,
            mlImages,
            interactions: interactions.map(({ id, ...i }) => ({
              ...i,
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
            />
            <BigRadio
              name="type"
              label="Detectietype"
              options={[{
                value: DeviceType.STATIC,
                icon: faQrcode,
                description: 'Gebruik een QR code als een startpunt voor de overlay. Vaak gebruikt voor stilstaande apparaten.',
                color: 'red-100',
                disabled: true
              }, {
                value: DeviceType.DYNAMIC,
                icon: faEye,
                description: 'Gebruik \'Machine Learning\' om het model en startpunt te herkennen. Vaak gebruikt voor mobiele apparaten.',
                color: 'green-100'
              }]}
            />
            <FileInput
              name="mlImages"
              label="Afbeeldingen zip"
              accept="application/zip"
              progress={progress}
            />
          </Column>
          <Column sizes={{ phone: 12 }}>
            <Editor name="interactions" image="image" type="type"/>
            <StyledActions>
              <Button text="Opslaan"/>
            </StyledActions>
          </Column>
        </Row>
      </Form>
    </>
  );
}

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;
