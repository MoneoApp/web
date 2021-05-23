import { inputObjectType } from 'nexus';

export const UpsertInteraction = inputObjectType({
  name: 'UpsertInteraction',
  definition: (t) => {
    t.nullable.id('id');
    t.field('type', { type: 'InteractionType' });
    t.float('x');
    t.float('y');
    t.float('width');
    t.float('height');
    t.float('rotation');
    t.string('title');
    t.string('description');
  }
});
