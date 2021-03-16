import { gql } from '@apollo/client';

const query = gql`
  query IndexQuery {
    users {
      id
      email
    }
  }
`;

export default function Index() {
  return (
    <div>
      Moneo
    </div>
  );
}
