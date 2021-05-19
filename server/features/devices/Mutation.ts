import { UserRole } from '@prisma/client';
import { extendType, list, nullable } from 'nexus';

import { CreateDevice } from '../../../shared/structs/CreateDevice';
import { UpdateDevice } from '../../../shared/structs/UpdateDevice';
import { authorized } from '../../guards/authorized';
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
        type: 'DeviceType',
        interactions: list('UpsertInteraction')
      },
      authorize: guard(
        authorized(),
        validated(CreateDevice)
      ),
      resolve: async (parent, { model, brand, image, type, interactions }, { db, user }) => {
        const fileName = await storeImage(image);

        return await db.device.create({
          data: {
            model,
            brand,
            image: fileName,
            type,
            user: {
              connect: { id: user!.id }
            },
            interactions: {
              createMany: {
                data: interactions.map(({ id, ...i }) => i)
              }
            }
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
        image: nullable('Upload'),
        interactions: list('UpsertInteraction')
      },
      authorize: guard(
        authorized(),
        validated(UpdateDevice)
      ),
      resolve: async (parent, { id, model, brand, image, interactions }, { db }) => {
        const fileName = image ? await storeImage(image) : undefined;

        return await db.device.update({
          where: { id },
          data: {
            model,
            brand,
            image: fileName,
            interactions: {
              upsert: interactions.map(({ id: interactionId, ...data }) => ({
                where: {
                  id: interactionId ?? undefined
                },
                create: data,
                update: data
              })),
              deleteMany: {
                id: { notIn: interactions.map((i) => i.id ?? '') }
              }
            }
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
        authorized(UserRole.ADMIN)
      ),
      resolve: async (parent, { id }, { db, user }) => {
        const transaction = await db.$transaction([
          db.manualStep.deleteMany({
            where: { manual: { device: { id } } }
          }),
          db.manual.deleteMany({
            where: { device: { id } }
          }),
          db.interaction.deleteMany({
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
