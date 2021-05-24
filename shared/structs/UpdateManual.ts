import { array, object, size, string } from 'superstruct';

import { UpsertManualStep } from './UpsertManualStep';

export const UpdateManual = object({
  id: string(),
  title: size(string(), 3, 70),
  steps: size(array(UpsertManualStep), 1, Infinity)
});
