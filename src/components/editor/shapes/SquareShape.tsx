import { Rect } from 'react-konva';

import { ShapeConfig } from '../../../types';

export function SquareShape({ width, height }: ShapeConfig) {
  return (
    <Rect
      fill="black"
      width={width}
      height={height}
    />
  )
}
