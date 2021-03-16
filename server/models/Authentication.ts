import { objectType } from 'nexus';

export const Authentication = objectType({
  name: 'Authentication',
  definition: (t) => {
    t.string('token');
    t.field('user', { type: 'User' });
  }
});
