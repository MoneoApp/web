import { enumType } from 'nexus';

export const ContentBlockType = enumType({
  name: 'ContentBlockType',
  members: ['TEXT', 'LIST', 'IMAGE']
});
