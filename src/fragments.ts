import { gql } from '@apollo/client';

export const interactionFragment = gql`
  fragment InteractionFragment on Interaction {
    id
    type
    x
    y
    width
    height
    rotation
  }
`;
