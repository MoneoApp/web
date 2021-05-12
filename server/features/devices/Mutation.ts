import { UserRole } from '@prisma/client';
import { extendType, nullable } from 'nexus';

import { CreateDevice } from '../../../shared/structs/CreateDevice';
import { UpdateDevice } from '../../../shared/structs/UpdateDevice';
import { authorized } from '../../guards/authorized';
import { current } from '../../guards/current';
import { or } from '../../guards/or';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';

export const DeviceMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createDevice', {
      type: 'Device',
      args: {
        model: 'String',
        brand: 'String',
        type: 'DeviceType'
      },
      authorize: guard(
        authorized(),
        validated(CreateDevice)
      ),
      resolve: (parent, { model, brand, type }, { db, user }) => db.device.create({
        data: {
          model,
          brand,
          image: 'unknown',
          type,
          userId: user!.id
        }
      })
    });

    t.field('updateDevice', {
      type: nullable('Device'),
      args: {
        id: 'ID',
        model: 'String',
        brand: 'String'
      },
      authorize: guard(
        or(current(), authorized(UserRole.ADMIN)),
        validated(UpdateDevice)
      ),
      resolve: (parent, { id, model, brand }, { db, user }) => db.device.update({
        where: { id },
        data: {
          model,
          brand
        }
      })
    });

    t.field('deleteDevice', {
      type: nullable('Device'),
      args: {
        id: 'ID'
      },
      authorize: guard(
        or(current(), authorized(UserRole.ADMIN))
      ),
      resolve: async (parent, { id }, { db, user }) => {
        const transaction = await db.$transaction([
          db.contentBlock.deleteMany({
            where: { interaction: { overlay: { device: { id } } } }
          }),
          db.interaction.deleteMany({
            where: { overlay: { device: { id } } }
          }),
          db.overlay.deleteMany({
            where: { device: { id } }
          }),
          db.device.delete({
            where: { id }
          })
        ]);

        return transaction[3];
      }
    });
  }
});
