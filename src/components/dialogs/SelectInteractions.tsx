import { DialoogProps } from 'dialoog';

import { InteractionFragment } from '../../apollo/InteractionFragment';
import { Dialog } from '../Dialog';

type Props = {
  image: string,
  interactions: InteractionFragment[]
};

export function SelectInteractions({ interactions, ...props }: Props & DialoogProps) {
  return (
    <Dialog {...props}/>
  );
}
