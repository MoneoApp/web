export function whereSearch<T extends string>(search?: string | null, ...fields: T[]) {
  if (!search) {
    return;
  }

  return {
    OR: fields.map((value) => ({
      [value]: {
        contains: search,
        mode: 'insensitive'
      }
    }))
  };
}
