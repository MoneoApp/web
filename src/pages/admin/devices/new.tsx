import { faEye, faQrcode } from '@fortawesome/free-solid-svg-icons';

import { BigRadio } from '../../../components/forms/BigRadio';
import { FileInput } from '../../../components/forms/FileInput';
import { Form } from '../../../components/forms/Form';
import { Input } from '../../../components/forms/Input';
import { Column } from '../../../components/layout/Column';
import { Row } from '../../../components/layout/Row';
import { Heading } from '../../../components/navigation/Heading';

export default function NewDevice() {
  return (
    <>
      <Heading text="Nieuw apparaat"/>
      <Row>
        <Column sizes={{ phone: 12, laptop: 6 }}>
          <Form onSubmit={console.log}>
            <Input name="model" label="Model"/>
            <Input name="brand" label="Merk"/>
            <FileInput name="image"/>
            <BigRadio
              name="type"
              label="Detectietype"
              options={[{
                value: 'STATIC',
                icon: faQrcode,
                description: 'Gebruik een QR code als een startpunt voor de overlay. Vaak gebruikt voor stilstaande apparaten.',
                color: 'red-100'
              }, {
                value: 'DYNAMIC',
                icon: faEye,
                description: 'Gebruik \'Machine Learning\' om het model en startpunt te herkennen. Vaak gebruikt voor mobiele apparaten.',
                color: 'green-100'
              }]}
            />
          </Form>
        </Column>
      </Row>
    </>
  );
}
