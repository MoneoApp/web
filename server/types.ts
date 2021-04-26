import { Context } from './context';

export type Guard = (args: unknown, ctx: Context) => void | Promise<void>;
