import styled from '@emotion/styled';
import { HexColorPicker } from 'react-colorful';

import { useClickOutside } from '../../hooks/useClickOutside';

type Props = {
  x: number,
  y: number,
  color: string,
  setColor: (color: string) => void,
  onClose: () => void
};

export function ColorPicker({ x, y, color, setColor, onClose }: Props) {
  const ref = useClickOutside<HTMLDivElement>(onClose, []);

  return (
    <StyledPicker ref={ref} style={{ top: y, left: x }}>
      <HexColorPicker color={color} onChange={setColor}/>
    </StyledPicker>
  );
}

const StyledPicker = styled.div`
  position: fixed;
  box-shadow: 0 0 4rem var(--gray-300);
  z-index: 2500;
`;
