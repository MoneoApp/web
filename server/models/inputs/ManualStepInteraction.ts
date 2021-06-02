import { inputObjectType } from 'nexus';

export const ManualStepInteraction = inputObjectType({
  name: 'ManualStepInteraction',
  definition: (t) => {
    t.id('id');
    t.string('color');
  }
});
