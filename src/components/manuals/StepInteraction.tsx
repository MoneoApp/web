import styled from '@emotion/styled';
import { faCheck, faPalette, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import { colors } from '../../constants';
import { Button } from '../forms/Button';

import { ColorPicker } from './ColorPicker';

type Props = {
  title: string,
  active: boolean,
  onToggle: () => void
};

export function StepInteraction({ title, active, onToggle }: Props) {
  const [color, setColor] = useState(colors.yellow['200']![0]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledInteraction>
        <Button
          text="Toggle"
          palette={['gray-500', active ? 'yellow-200' : 'gray-200']}
          onClick={onToggle}
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
