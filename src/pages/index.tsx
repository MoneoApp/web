import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { superstructResolver } from '@hookform/resolvers/superstruct';
import { useForm } from 'react-hook-form';

import { Login } from '../../shared/structs/Login';
import { IndexMutation, IndexMutationVariables } from '../apollo/IndexMutation';

const mutation = gql`
  mutation IndexMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default function Index() {
  const [mutate] = useMutation<IndexMutation, IndexMutationVariables>(mutation);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: superstructResolver(Login)
  });

  return (
    <StyledRoot>
      <StyledBackground/>
      <StyledSidePanel>

        <StyledHeader>
          <StyledLogo src="/logo.png"/>
          <StyledName>
            Moneo
          </StyledName>
        </StyledHeader>

        <StyledForm onSubmit={handleSubmit((data) => mutate({ variables: data as any }))}>
          <StyledInputGroups>
            <StyledLabel>
              E-mail
            </StyledLabel>
            <StyledInput {...register('email')}/>
            {errors.email && (
              <StyledError>email not ok</StyledError>
            )}
          </StyledInputGroups>
          <StyledInputGroups>
            <StyledLabel>
              Password
            </StyledLabel>
            <StyledInput type="password" {...register('password')}/>
            {errors.password && (
              <StyledError>password not ok</StyledError>
            )}
          </StyledInputGroups>
          <StyledButton type="submit">
            Login
          </StyledButton>
        </StyledForm>
      </StyledSidePanel>
    </StyledRoot>
  );
}

const StyledRoot = styled.div`
  display: flex;
  height: 100vh;
  background: #14213D;
`;

const StyledBackground = styled.div`
  flex: 1;
  background: url("/background.jpg") center;
  background-size: cover;
`;

const StyledSidePanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  background: #FCA311;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  justify-content: flex-end;
`;

const StyledLogo = styled.img`
  width: 50%;
  padding: 2rem 0;
`;

const StyledName = styled.h1`
  color: white;
  font-weight: bold;
  padding-bottom: 3rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 5rem;
`;

const StyledInputGroups = styled.div`
  display: flex;
  flex-direction: column;
  width: 20rem;
  margin: 0.5rem;
`;

const StyledLabel = styled.label`
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  padding: 0.25rem;
`;

const StyledInput = styled.input`
  width: 100%;
  border: 1px solid grey;
  background: white;
  padding: 0.5rem;
  border-radius: 30px;
`;

const StyledButton = styled.button`
  padding: 0.5rem 2rem;
  border-radius: 30px;
  color: black;
  background: white;
  margin: 0.25rem;

  &:hover {
    background: grey;
  }
`;

const StyledError = styled.span`
  background: red;
  color: white;
  border-radius: 30px;
  padding: 0.25rem 0.5rem;
  margin: 0.25rem;
`;
