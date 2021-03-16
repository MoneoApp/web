import { gql, useMutation } from '@apollo/client';
import { superstructResolver } from '@hookform/resolvers/superstruct';
import { useForm } from 'react-hook-form';

import { Login } from '../../structs/Login';
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
    <div>
      <form onSubmit={handleSubmit((data) => mutate({ variables: data as any }))}>
        <div>
          <input {...register('email')}/>
          {errors.email && (
            <span>email not ok</span>
          )}
        </div>
        <div>
          <input type="password" {...register('password')}/>
          {errors.password && (
            <span>password not ok</span>
          )}
        </div>
        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
