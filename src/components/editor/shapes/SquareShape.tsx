import { Rect } from 'react-konva';

import { ShapeConfig } from '../../../types';

export function SquareShape({ width, height }: ShapeConfig) {
  return (
    <Rect
      fill="black"
      opacity={.5}
      width={width}
      height={height}
      strokeWidth={1}
      stroke="white"
    />
  )
}
