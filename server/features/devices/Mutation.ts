import { UserRole } from '@prisma/client';
import { extendType, nullable } from 'nexus';

import { CreateDevice } from '../../../shared/structs/CreateDevice';
import { UpdateDevice } from '../../../shared/structs/UpdateDevice';
import { authorized } from '../../guards/authorized';
import { current } from '../../guards/current';
import { or } from '../../guards/or';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';
import { storeImage } from '../../utils/storeImage';

export const DeviceMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createDevice', {
      type: 'Device',
      args: {
        model: 'String',
        brand: 'String',
        image: 'Upload',
        type: 'DeviceType'
      },
      authorize: guard(
        authorized(),
        validated(CreateDevice)
      ),
      resolve: async (parent, { model, brand, image, type }, { db, user }) => {
        const fileName = await storeImage(image);

        return await db.device.create({
          data: {
            model,
            brand,
            image: fileName,
            type,
            userId: user!.id
          }
        });
      }
    });

    t.field('updateDevice', {
      type: nullable('Device'),
      args: {
        id: 'ID',
        model: 'String',
        brand: 'String',
        image: nullable('Upload')
      },
      authorize: guard(
        or(current(), authorized(UserRole.ADMIN)),
        validated(UpdateDevice)
      ),
      resolve: async (parent, { id, model, brand, image }, { db }) => {
        const fileName = image ? await storeImage(image) : undefined;

        return await db.device.update({
          where: { id },
          data: {
            model,
            brand,
            image: fileName
          }
        });
      }
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
