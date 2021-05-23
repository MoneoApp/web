import { inputObjectType } from 'nexus';

export const UpsertManualStep = inputObjectType({
  name: 'UpsertManualStep',
  definition: (t) => {
    t.nullable.id('id');
    t.string('text');
    t.int('order');
    t.list.id('interactionIds');
  }
});
