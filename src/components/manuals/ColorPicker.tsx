import styled from '@emotion/styled';
import { HexColorPicker } from 'react-colorful';

import { useClickOutside } from '../../hooks/useClickOutside';

type Props = {
  color: string,
  setColor: (color: string)=> void,
  onClose: () => void
};

export function ColorPicker({ color, setColor, onClose }: Props) {
  const ref = useClickOutside<HTMLDivElement>(onClose, []);

  return (
    <StyledWrapper>
      <StyledPicker ref={ref}>
        <HexColorPicker color={color} onChange={setColor}/>
      </StyledPicker>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledPicker = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  border-radius: 9px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
`;
