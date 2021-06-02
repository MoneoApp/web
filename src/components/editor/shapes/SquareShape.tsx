import { Rect } from 'react-konva';

import { ShapeConfig } from '../../../types';

export function SquareShape({ width, height, color }: ShapeConfig) {
  return (
    <Rect
      fill={color ?? 'black'}
      opacity={color ? 1 : .5}
      width={width}
      height={height}
      stroke="white"
      strokeWidth={color ? 0 : 1}
    />
  );
}
