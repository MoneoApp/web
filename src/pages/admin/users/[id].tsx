import { gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

import { UserMutation, UserMutationVariables } from '../../../apollo/UserMutation';
import { UserQuery, UserQueryVariables } from '../../../apollo/UserQuery';
import { Button } from '../../../components/forms/Button';
import { Form } from '../../../components/forms/Form';
import { Input } from '../../../components/forms/Input';
import { Column } from '../../../components/layout/Column';
import { Row } from '../../../components/layout/Row';
import { Heading } from '../../../components/navigation/Heading';
import { Table } from '../../../components/users/Table';
import { roles } from '../../../constants';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { useNotify } from '../../../hooks/useNotify';

const query = gql`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      email
      role
      devices {
        id
        model
        brand
      }
    }
  }
`;

const mutation = gql`
  mutation UserMutation($id: ID!, $email: String!, $role: UserRole!) {
    updateUser(id: $id, email: $email, role: $role) {
      id
      email
      role
    }
  }
`;

export default function User() {
  const skip = useAuthGuard();
  const { query: { id } } = useRouter();
  const notify = useNotify();
  const { data } = useQuery<UserQuery, UserQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: { id: id as string }
  });
  const [mutate] = useMutation<UserMutation, UserMutationVariables>(mutation, {
    onCompleted: () => notify('Successvol gebruiker bijgewerkt')
  });

  return (
    <>
      <Heading text="Gebruiker"/>
      {data?.user && (
        <>
          <Row>
            <Column sizes={{ phone: 12, laptop: 6 }}>
              <Form
                values={{
                  id: data.user.id,
                  email: data.user.email,
                  role: data.user.role
                }}
                onSubmit={(variables) => mutate({ variables })}
              >
                <Input name="email" label="E-mail"/>
                <Input as="select" name="role" label="Rol">
                  {Object.entries(roles).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Input>
                <StyledActions>
                  <Button text="Opslaan"/>
                </StyledActions>
              </Form>
            </Column>
          </Row>
          <Table
            data={data.user.devices}
            keyBy="id"
            href={(value) => `/admin/devices/${value.id}`}
            columns={{
              model: { title: 'Model' },
              brand: {
                title: 'Merk',
                size: '10rem'
              }
            }}
          />
        </>
      )}
    </>
  );
};

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;
