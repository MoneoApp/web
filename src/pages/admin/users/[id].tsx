import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { UserQuery, UserQueryVariables } from '../../../apollo/UserQuery';
import { Form } from '../../../components/forms/Form';
import { Input } from '../../../components/forms/Input';
import { Column } from '../../../components/layout/Column';
import { Row } from '../../../components/layout/Row';
import { Heading } from '../../../components/navigation/Heading';
import { roles } from '../../../constants';
import { useAuthGuard } from '../../../hooks/useAuthGuard';

const query = gql`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      email
      role
    }
  }
`;

export default function User() {
  const skip = useAuthGuard();
  const { query: { id } } = useRouter();
  const { data } = useQuery<UserQuery, UserQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: { id: id as string }
  });

  return (
    <>
      <Heading text="Gebruiker"/>
      {data?.user && (
        <Row>
          <Column sizes={{ phone: 12, laptop: 6 }}>
            <Form
              values={{
                email: data.user.email,
                role: data.user.role
              }}
              onSubmit={console.log}
            >
              <Input name="email" label="E-mail"/>
              <Input as="select" name="role" label="Rol">
                {Object.entries(roles).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Input>
            </Form>
          </Column>
        </Row>
      )}
    </>
  );
};
