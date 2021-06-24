import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ScoreMutation, ScoreMutationVariables } from '../../apollo/ScoreMutation';
import { shapeIcons } from '../../constants';
import { useNotify } from '../../hooks/useNotify';
import { ShapeConfig } from '../../types';
import { Button } from '../forms/Button';

const mutation = gql`
  mutation ScoreMutation($image: Upload!, $interaction: UpsertInteraction!) {
    score(image: $image, interaction: $interaction)
  }
`;

type Props = {
  image?: File,
  interaction?: ShapeConfig
};

export function Toolbox({ image, interaction }: Props) {
  const notify = useNotify();
  const [mutate] = useMutation<ScoreMutation, ScoreMutationVariables>(mutation, {
    onCompleted: ({ score }) => notify(`De score is ${score}. ${score >= 75 ? 'Ziet er goed uit!' : 'Probeer meer unieke eigenschappen er in te krijgen.'}`, 5000)
  });

  return (
    <StyledToolbox>
      <StyledLabel>
        Toolbox
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
      {image && interaction && (
        <Button
          text="Controlleer anker"
          type="button"
          onClick={() => mutate({
            variables: {
              image,
              interaction
            }
          })}
        />
      )}
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
  margin-bottom: .5rem;
  padding-top: .5rem;
`;

const StyledShape = styled.div`
  padding: .25rem;
  color: var(--yellow-200);
  background-color: var(--gray-500);
  border-radius: 4px;
`;
