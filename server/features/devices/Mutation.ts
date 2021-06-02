import { DeviceType, InteractionType, UserRole } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';
import { extendType, list, nullable } from 'nexus';

import { Error } from '../../../shared/constants';
import { CreateDevice } from '../../../shared/structs/CreateDevice';
import { UpdateDevice } from '../../../shared/structs/UpdateDevice';
import { authorized } from '../../guards/authorized';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';
import { mail } from '../../utils/mail';
import { storeFile } from '../../utils/storeFile';

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
        mlImages: 'Upload',
        interactions: list('UpsertInteraction')
      },
      authorize: guard(
        authorized(),
        validated(CreateDevice)
      ),
      resolve: async (parent, { model, brand, image, type, mlImages, interactions }, { db, user }) => {
        const wanted = type === DeviceType.DYNAMIC ? 1 : 0;

        if (interactions.filter((i) => i.type === InteractionType.ANCHOR).length !== wanted) {
          throw new ApolloError('invalid interactions', Error.InvalidInteractions);
        }

        const fileName = await storeFile(image, 'image/');
        const zipFileName = await storeFile(mlImages, 'application/zip');

        const admins = await db.user.findMany({
          where: { role: UserRole.ADMIN },
          select: { email: true }
        });
        const adminEmail = Object.values(admins).map((a) => a.email);

        await mail({
          to: adminEmail,
          subject: 'ML zip ontvangen',
          html: `Een klant heeft een zip geüpload voor ${brand}/${model}. Klik <a href="${process.env.PUBLIC_URL}/uploads/${zipFileName}">hier</a> om de zip te downloaden`
        });

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

        const fileName = image ? await storeFile(image, 'image/') : undefined;

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
