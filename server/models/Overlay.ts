import { objectType } from 'nexus';

export const Overlay = objectType({
  name: 'Overlay',
  definition: (t) => {
    t.id('id');
    t.string('name');
  }
});
