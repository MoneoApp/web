import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';

import { RetrainMutation } from '../../apollo/RetrainMutation';
import { Button } from '../../components/forms/Button';
import { Column } from '../../components/layout/Column';
import { Row } from '../../components/layout/Row';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { useNotify } from '../../hooks/useNotify';

const mutation = gql`
  mutation RetrainMutation {
    retrain
  }
`;

export default function Support() {
  const notify = useNotify();
  const [mutate] = useMutation<RetrainMutation>(mutation, {
    onCompleted: ({ retrain }) => notify(retrain ? 'Successvol trainen gestart' : 'Trainen al bezig')
  });

  useAuthGuard();

  return (
    <Row spacing={{ phone: 2 }}>
      <Column sizes={{ phone: 12, laptop: 6 }}>
        Om het model bij te werken op de Moneo app, kan op de onderstaande knop gedrukt worden. Na het uitvoeren van de
        actie kan het een uur duren voordat gebruikers het nieuwe model te zien krijgen.
      </Column>
      <Column sizes={{ phone: 12 }}>
        <StyledButton
          text="Model trainen"
          onClick={() => mutate()}
        />
      </Column>
    </Row>
  );
}

const StyledButton = styled(Button)`
  align-self: flex-start;
`;
