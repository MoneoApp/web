export const secret = process.env.SECRET ?? '';
export const reflection = Boolean(process.env.REFLECTION);
export const overrides: Record<string, string> = { 'application/x-zip-compressed': 'application/zip' };
