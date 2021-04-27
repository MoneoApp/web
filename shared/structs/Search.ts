import { object, string } from 'superstruct';

export const Search = object({
  query: string()
});
