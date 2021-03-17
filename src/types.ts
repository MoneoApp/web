export type Breakpoint = 'phone' | 'tabletPortrait' | 'tabletLandscape' | 'laptop' | 'desktop';
export type Breakpoints<T> = Partial<Record<Breakpoint, T>>;

export type Color = 'grey' | 'yellow' | 'green' | 'red';
export type Shade = 0 | 100 | 200 | 300 | 400 | 500;
export type ColorShade = `${Color}-${Shade}`;
