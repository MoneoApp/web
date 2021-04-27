export function groupData<T>(data: T[], groupBy: keyof T) {
  return data.reduce<Record<string, T[]>>((acc, value) => {
    const group = String(value[groupBy]);

    return {
      ...acc,
      [group]: [
        ...acc[group] || [],
        value
      ]
    };
  }, {});
}
