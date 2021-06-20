import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AdminQuery } from '../../apollo/AdminQuery';
import { Spinner } from '../../components/Spinner';
import { userTypes } from '../../constants';
import { useAuthGuard } from '../../hooks/useAuthGuard';

const query = gql`
  query AdminQuery {
    me {
      id
      email
      type
      customer {
        id
        name
      }
    }
  }
`;

export default function Admin() {
  const skip = useAuthGuard();
  const { data } = useQuery<AdminQuery>(query, { skip });

  return data ? (
    <StyledCard>
      <FontAwesomeIcon icon={faUser}/>
      Ingelogd als {data.me.email}
      <span>{userTypes[data.me.type]} voor {data.me.customer.name}</span>
    </StyledCard>
  ) : (
    <Spinner text="Gegevens ophalen..."/>
  );
}

const StyledCard = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: .5rem;
  padding: 1rem;
  background-color: var(--gray-200);
  border-radius: .5rem;
`;
