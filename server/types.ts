import { Context } from './context';

export type Guard = (args: GuardArgs) => void;
export type GuardArgs = Omit<Context, 'guard'>;
