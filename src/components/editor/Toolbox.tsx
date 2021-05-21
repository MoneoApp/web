import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { shapeIcons } from '../../constants';

export function Toolbox() {
  return (
    <StyledToolbox>
      <StyledLabel>
        toolbox
      </StyledLabel>
      <StyledShapes>
        {Object.entries(shapeIcons).map(([shape, icon]) => (
          <StyledShape
            key={shape}
            draggable={true}
            onDragStart={(e) => e.dataTransfer.setData('type', shape)}
          >
            <FontAwesomeIcon icon={icon!} fixedWidth={true}/>
          </StyledShape>
        ))}
      </StyledShapes>
    </StyledToolbox>
  );
}

const StyledToolbox = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: .5rem .75rem;
  background-color: var(--gray-200);
  border-radius: 8px;
`;

const StyledLabel = styled.span`
  color: var(--gray-400);
  font-size: .75rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const StyledShapes = styled.div`
  display: flex;
  gap: .5rem;
  padding-top: .5rem;
`;

const StyledShape = styled.div`
  padding: .25rem;
  color: var(--yellow-200);
  background-color: var(--gray-500);
  border-radius: 4px;
`;
