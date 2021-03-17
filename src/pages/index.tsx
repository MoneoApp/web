import { gql, useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Login } from '../../shared/structs/Login';
import { IndexMutation, IndexMutationVariables } from '../apollo/IndexMutation';
import background from '../assets/background.jpg';
import Logo from '../assets/logo.svg';
import { Button } from '../components/forms/Button';
import { Form } from '../components/forms/Form';
import { Input } from '../components/forms/Input';
import { breakpoint } from '../utils/breakpoint';

const mutation = gql`
  mutation IndexMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default function Index() {
  const [mutate] = useMutation<IndexMutation, IndexMutationVariables>(mutation);

  return (
    <StyledRoot>
      <StyledBackground/>
      <StyledSidebar>
        <StyledHeader>
          <StyledLogo/>
          <StyledTitle>
            Moneo
          </StyledTitle>
        </StyledHeader>
        <Form struct={Login} onSubmit={(variables) => mutate({ variables })}>
          <StyledForm>
            <Input name="email" label="E-mail"/>
            <Input name="password" label="Password" type="password"/>
            <Button text="Login" type="submit"/>
          </StyledForm>
        </Form>
      </StyledSidebar>
    </StyledRoot>
  );
}

const StyledRoot = styled.main`
  display: flex;
  height: 100vh;
  background: #14213d;
`;

const StyledBackground = styled.div`
  flex: 1;
  background: url(${background}) center;
  background-size: cover;
`;

const StyledSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${breakpoint('tabletLandscape', css`
    width: 25rem;
  `)};
`;

const StyledHeader = styled.header`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background: #fca311;
  border-radius: 0 0 24px 24px;
`;

const StyledLogo = styled(Logo)`
  width: 10rem;
  color: white;
`;

const StyledTitle = styled.h1`
  padding: 3rem 0;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 3rem;
`;
