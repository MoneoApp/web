import { Circle, Rect } from 'react-konva';

import { ShapeConfig } from '../../../types';

export function CircleShape({ width, height }: ShapeConfig) {
  return (
    <Rect
      fill="black"
      width={width}
      height={height}
      cornerRadius={Math.max(width, height)}
    />
  )
}
