import { Rect } from 'react-konva';

import { ShapeConfig } from '../../../types';

export function AnchorShape({ width, height }: ShapeConfig) {
  return (
    <Rect
      width={width}
      height={height}
      stroke="black"
      strokeWidth={4}
    />
  );
}
