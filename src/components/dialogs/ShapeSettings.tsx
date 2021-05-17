import { DialoogProps } from 'dialoog';

import { ShapeConfig } from '../../types';
import { Dialog } from '../Dialog';

type Props = {
  shape: ShapeConfig
};

export function ShapeSettings({ shape, ...props }: Props & DialoogProps) {
  return (
    <Dialog {...props}>
      {shape.id}
    </Dialog>
  );
}
