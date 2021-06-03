import { DeviceType, InteractionType, UserRole } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';
import { extendType, list, nullable } from 'nexus';

import { Error } from '../../../shared/constants';
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
        const wanted = type === DeviceType.DYNAMIC ? 1 : 0;

        if (interactions.filter((i) => i.type === InteractionType.ANCHOR).length !== wanted) {
          throw new ApolloError('invalid interactions', Error.InvalidInteractions);
        }

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
        const device = await db.device.findUnique({
          where: { id }
        });

        if (!device) {
          return null;
        }

        const wanted = device.type === DeviceType.DYNAMIC ? 1 : 0;

        if (interactions.filter((i) => i.type === InteractionType.ANCHOR).length !== wanted) {
          throw new ApolloError('invalid interactions', Error.InvalidInteractions);
        }

        const fileName = image ? await storeImage(image) : undefined;
        const used = await db.manualStepInteraction.findMany({
          where: {
            interaction: {
              id: { in: interactions.map((i) => i.id ?? '') }
            }
          },
          select: {
            interactionId: true
          }
        });

        return await db.device.update({
          where: { id },
          data: {
            model,
            brand,
            image: fileName,
            interactions: {
              deleteMany: {
                id: {
                  notIn: [
                    ...interactions.map((i) => i.id ?? ''),
                    ...used.map((i) => i.interactionId)
                  ]
                }
              },
              upsert: interactions.map(({ id: interactionId, ...data }) => ({
                where: {
                  id: interactionId ?? ''
                },
                create: data,
                update: data
              }))
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
