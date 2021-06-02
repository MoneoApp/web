import { inputObjectType } from 'nexus';

export const UpsertManualStep = inputObjectType({
  name: 'UpsertManualStep',
  definition: (t) => {
    t.string('text');
    t.int('order');
    t.list.field('interactions', { type: 'ManualStepInteraction' });
  }
});
