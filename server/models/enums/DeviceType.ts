import { enumType } from 'nexus';

export const DeviceType = enumType({
  name: 'DeviceType',
  members: [
    'STATIC',
    'DYNAMIC'
  ]
});
