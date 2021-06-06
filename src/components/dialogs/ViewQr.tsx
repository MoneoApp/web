import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';
import QRCode from 'qrcode.react';

import { Dialog } from '../Dialog';
import { Button } from '../forms/Button';

type Props = {
  id: string
};

export function PreviewQr({ id, ...props }: Props & DialoogProps) {
  return (
    <StyledDialog {...props}>
      <StyledQRCode renderAs="svg" includeMargin={true} size={256} value={id}/>
      <StyledTitle>
        Open de app en scan deze QR code om dit apparaat weer te geven.
        Dit werkt met de laatst opgeslagen data.
      </StyledTitle>
      <StyledActions>
        <Button text="Sluit" onClick={props.close}/>
      </StyledActions>
    </StyledDialog>
  );
}
const StyledDialog = styled(Dialog)`
  display: flex;
  flex-direction: column;
`;

const StyledTitle = styled.h2`
  margin-top: .75rem;
  max-width: 256px;
  text-align: center;
`;

const StyledQRCode = styled(QRCode)`
  border-radius: 8px;
  align-self: center;
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;
