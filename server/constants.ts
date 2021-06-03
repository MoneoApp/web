export const secret = process.env.SECRET ?? '';
export const reflection = Boolean(process.env.REFLECTION);

export const mimeOverrides: Record<string, string> = {
  'application/x-zip-compressed': 'application/zip'
};
