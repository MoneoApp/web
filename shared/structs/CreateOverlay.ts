import { object, size, string } from 'superstruct';

export const CreateOverlay = object({
  deviceId: string(),
  name: size(string(), 3, 70)
});
