import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

export function useSearch<T>(data: T[] | undefined, keys: string[]) {
  const [search, setSearch] = useState('');
  const fuse = useMemo(() => new Fuse(data ?? [], { keys }), [data]);
  const results = useMemo(() => !search ? data : fuse.search(search).map(({ item }) => item), [search, fuse]);

  return [results, setSearch] as const;
}
