import { DeviceType, InteractionType, UserType } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';
import extract from 'extract-zip';
import { rmdir } from 'fs/promises';
import { arg, extendType, idArg, list, nullable, stringArg } from 'nexus';
import { join } from 'path';

import { Error } from '../../../shared/constants';
import { CreateDevice } from '../../../shared/structs/CreateDevice';
import { UpdateDevice } from '../../../shared/structs/UpdateDevice';
import { authorized } from '../../guards/authorized';
import { customer } from '../../guards/customer';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';
import { storeFile } from '../../utils/storeFile';

export const DeviceMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createDevice', {
      type: 'Device',
      description: 'Create a device with the specified details. Only accessible by roles: ADMIN, CONTACT, USER. If CONTACT or USER, must be part of the same customer network.',
      args: {
        model: stringArg({
          description: 'The name of the device model. Must be 3 to 70 characters long.'
        }),
        brand: stringArg({
          description: 'The name of the device brand. Must be 3 to 70 characters long.'
        }),
        image: arg({
          type: 'Upload',
          description: 'The thumbnail image of the device. Must be a .PNG or .JPG.'
        }),
        type: arg({
          type: 'DeviceType',
          description: 'The type of learning used for device recognition.'
        }),
        mlImages: nullable(arg({
          type: 'Upload',
          description: 'The training images of the device. Must be a .ZIP.'
        })),
        interactions: list(arg({
          type: 'UpsertInteraction',
          description: 'The list of interactions associated with the device.'
        }))
      },
      authorize: guard(
        authorized(),
        validated(CreateDevice)
      ),
      resolve: async (parent, { model, brand, image, type, mlImages, interactions }, { db, user }) => {
        const anchors = type === DeviceType.DYNAMIC ? 1 : 0;

        if (interactions.filter((i) => i.type === InteractionType.ANCHOR).length !== anchors) {
          throw new ApolloError('invalid interactions', Error.InvalidInteractions);
        }

        const data = await db.user.findUnique({
          where: { id: user!.id }
        }).customer();

        if (!data) {
          throw new ApolloError('unknown', Error.Unknown);
        }

        const imageName = await storeFile(image, 'image/');

        const device = await db.device.create({
          data: {
            model,
            brand,
            image: imageName,
            type,
            customer: {
              connect: { id: data.id }
            },
            interactions: {
              createMany: {
                data: interactions.map(({ id, ...i }) => i)
              }
            }
          }
        });

        if (anchors) {
          const zipName = await storeFile(mlImages, 'application/zip', `ml-${device.id}`);
          await extract(join(process.cwd(), 'public', 'uploads', zipName), {
            dir: join(process.cwd(), 'work', device.id)
          });
        }

        return device;
      }
    });

    t.field('updateDevice', {
      type: nullable('Device'),
      description: 'Update the specified device. Only accessible by roles: ADMIN, CONTACT, USER. If CONTACT or USER, must be part of the same customer network.',
      args: {
        id: idArg({
          description: 'The ID of the device. Must be a valid ID.'
        }),
        model: stringArg({
          description: 'The name of the device model. Must be 3 to 70 characters long.'
        }),
        brand: stringArg({
          description: 'The name of the device brand. Must be 3 to 70 characters long.'
        }),
        image: nullable(arg({
          type: 'Upload',
          description: 'The thumbnail images of the device. If set, must be a .PNG or .JPG.'
        })),
        interactions: list(arg({
          type: 'UpsertInteraction',
          description: 'The list of interactions associated with the device.'
        }))
      },
      authorize: guard(
        authorized(),
        validated(UpdateDevice),
        customer(({ id }) => ({
          devices: {
            some: { id }
          }
        }))
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

        const fileName = image ? await storeFile(image, 'image/') : undefined;
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
      description: 'Delete the specified device. Only accessible by roles: ADMIN, CONTACT. If CONTACT, must be part of the same customer network.',
      args: {
        id: idArg({
          description: 'The ID of the device. Must be a valid ID.'
        })
      },
      authorize: guard(
        authorized(UserType.ADMIN, UserType.CONTACT),
        customer(({ id }) => ({
          devices: {
            some: { id }
          }
        }))
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

        await rmdir(join(process.cwd(), 'work', id), { recursive: true });

        return transaction[3];
      }
    });
  }
});
