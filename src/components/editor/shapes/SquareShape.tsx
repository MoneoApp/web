import { Rect } from 'react-konva';

import { colors } from '../../../constants';
import { ShapeConfig } from '../../../types';

export function SquareShape({ width, height, color }: ShapeConfig) {
  return (
    <Rect
      fill={color ?? 'black'}
      opacity={.5}
      width={width}
      height={height}
      stroke={color ? colors.yellow['200']![0] : 'white'}
      strokeWidth={color ? 10 : 1}
    />
  );
}
