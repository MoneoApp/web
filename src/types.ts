import { InteractionType } from './apollo/globalTypes';

export type Breakpoint = 'phone' | 'tabletPortrait' | 'tabletLandscape' | 'laptop' | 'desktop';
export type Breakpoints<T> = Partial<Record<Breakpoint, T>>;

export type Color = 'gray' | 'yellow' | 'green' | 'red';
export type Shade = 0 | 100 | 200 | 300 | 400 | 500;
export type ColorShade = `${Color}-${Shade}`;
export type ColorPalette = [ColorShade, ColorShade];

export type ShapeConfig = {
  id: string,
  type: InteractionType,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
  color?: string
};

export type InteractionConfig = {
  id: string,
  color: string
};
