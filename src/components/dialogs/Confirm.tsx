import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';

import { Dialog } from '../Dialog';
import { Button } from '../forms/Button';

type Props = {
  text: string,
  onConfirm: () => void
};

export function Confirm({ text, onConfirm, ...props }: Props & DialoogProps) {
  return (
    <Dialog {...props}>
      <StyledTitle>
        {text}
      </StyledTitle>
      <StyledActions>
        <Button text="Annuleren" onClick={props.close}/>
        <Button
          text="Bevestigen"
          palette={['red-200', 'gray-0']}
          onClick={() => {
            onConfirm();
            props.close();
          }}
        />
      </StyledActions>
    </Dialog>
  );
}

const StyledTitle = styled.h2`
  font-weight: bold;
  margin-bottom: .75rem;
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;
