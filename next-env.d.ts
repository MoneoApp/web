/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.svg' {
  import { ComponentType, SVGProps } from 'react';

  const value: ComponentType<SVGProps<SVGElement>>;

  export default value;
}

declare module '*.jpg' {
  const value: string;

  export = value;
}

declare module '*.png' {
  const value: string;

  export = value;
}
