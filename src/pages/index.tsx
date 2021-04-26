import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

import { Login } from '../../shared/structs/Login';
import { IndexMutation, IndexMutationVariables } from '../apollo/IndexMutation';
import background from '../assets/background.jpg';
import Logo from '../assets/logo.svg';
import { Button } from '../components/forms/Button';
import { Form } from '../components/forms/Form';
import { Input } from '../components/forms/Input';
import { Empty } from '../components/templates/Empty';
import { useAuthentication } from '../states/authentication';

const mutation = gql`
  mutation IndexMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default function Index() {
  const { push } = useRouter();
  const [, { login }] = useAuthentication();
  const [mutate] = useMutation<IndexMutation, IndexMutationVariables>(mutation, {
    onCompleted: ({ login: { token } }) => login(token).then(() => push('/admin'))
  });

  return (
    <StyledRoot>
      <Form struct={Login} onSubmit={(variables) => mutate({ variables })}>
        <StyledForm>
          <StyledBrand>
            <StyledLogo/>
            Moneo
          </StyledBrand>
          <Input name="email" label="E-mail"/>
          <Input name="password" label="Password" type="password"/>
          <Button text="Login" type="submit"/>
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
    background: url(${background}) center;
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
  background-color: var(--grey-0);
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
