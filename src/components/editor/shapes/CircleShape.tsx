import { Rect } from 'react-konva';

import { ShapeConfig } from '../../../types';

export function CircleShape({ width, height }: ShapeConfig) {
  return (
    <Rect
      fill="black"
      opacity={.5}
      width={width}
      height={height}
      stroke="white"
      strokeWidth={1}
      cornerRadius={Math.max(width, height)}
    />
  );
}
