import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

import { CreateUser } from '../../shared/structs/CreateUser';
import { Login } from '../../shared/structs/Login';
import { LoginMutation, LoginMutationVariables } from '../apollo/LoginMutation';
import { RegisterMutation, RegisterMutationVariables } from '../apollo/RegisterMutation';
import { Button } from '../components/forms/Button';
import { Form } from '../components/forms/Form';
import { Input } from '../components/forms/Input';
import { Logo } from '../components/Logo';
import { Empty } from '../components/templates/Empty';
import { useNotify } from '../hooks/useNotify';
import { useAuthentication } from '../states/authentication';

const loginMutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        role
      }
    }
  }
`;

const registerMutation = gql`
  mutation RegisterMutation($inviteId: ID!, $password: String!) {
    createUser(inviteId: $inviteId, password: $password) {
      id
    }
  }
`;

export default function Index() {
  const notify = useNotify();
  const { push, query: { invite } } = useRouter();
  const [, { login }] = useAuthentication();
  const [mutateLogin] = useMutation<LoginMutation, LoginMutationVariables>(loginMutation, {
    onCompleted: ({ login: { token, user: { role } } }) => login(token, role).then(() => push('/admin'))
  });
  const [mutateRegister] = useMutation<RegisterMutation, RegisterMutationVariables>(registerMutation, {
    onCompleted: () => {
      notify('Succesvol geregistreerd');
      void push('/');
    }
  });

  return (
    <StyledRoot>
      <Form<any>
        struct={invite ? CreateUser : Login}
        values={invite ? {
          inviteId: invite
        } : undefined}
        onSubmit={(variables) => invite ? mutateRegister({ variables }) : mutateLogin({ variables })}
      >
        <StyledForm>
          <StyledBrand>
            <StyledLogo/>
            Moneo
          </StyledBrand>
          {!invite && (
            <Input name="email" label="E-mail"/>
          )}
          <Input name="password" label="Wachtwoord" type="password"/>
          <Button text={invite ? 'Registreren' : 'Inloggen'}/>
        </StyledForm>
      </Form>
    </StyledRoot>
  );
}

Index.template = Empty;

const StyledRoot = styled.main`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -16px;
    left: -16px;
    width: calc(100% + 32px);
    height: calc(100% + 32px);
    background: url("/background.jpg") center;
    background-size: cover;
    filter: blur(8px);
  }
`;

const StyledForm = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 27.5rem;
  max-width: calc(100vw - 2rem);
  padding: 1.5rem;
  background-color: var(--gray-0);
  border-radius: 16px;
`;

const StyledBrand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  margin-bottom: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const StyledLogo = styled(Logo)`
  width: 3rem;
  margin-bottom: .75rem;
`;
