import { gql } from '@apollo/client';

const query = gql`
  query IndexQuery {
    ok
  }
`;

export default function Index() {
  return (
    <div>
      Moneo
    </div>
  );
}
