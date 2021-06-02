import styled from '@emotion/styled';
import { faCheck, faPalette, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import { Button } from '../forms/Button';

import { ColorPicker } from './ColorPicker';

type Props = {
  title: string,
  active: boolean,
  color: string,
  setColor: (color: string) => void,
  onToggle: (color: string) => void
};

export function StepInteraction({ title, active, color: defaultColor, setColor: saveColor, onToggle }: Props) {
  const [color, setColor] = useState(defaultColor);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    saveColor(color);
  }, [color]);

  return (
    <>
      <StyledInteraction>
        <Button
          text="Toggle"
          palette={['gray-500', active ? 'yellow-200' : 'gray-200']}
          onClick={() => onToggle(color)}
        >
          <FontAwesomeIcon icon={active ? faCheck : faTimes} fixedWidth={true}/>
        </Button>
        {active && (
          <Button
            text="T"
            style={{ backgroundColor: color }}
            onClick={() => setOpen(true)}
          >
            <FontAwesomeIcon icon={faPalette} fixedWidth={true}/>
          </Button>
        )}
        {title}
      </StyledInteraction>
      {open && (
        <ColorPicker
          color={color}
          setColor={setColor}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

const StyledInteraction = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
