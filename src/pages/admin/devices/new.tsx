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
          </Form>
        </Column>
      </Row>
    </>
  );
}
