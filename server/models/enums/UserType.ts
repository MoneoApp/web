import { enumType } from 'nexus';

export const UserType = enumType({
  name: 'UserType',
  members: [
    'USER',
    'CONTACT',
    'ADMIN'
  ]
});
