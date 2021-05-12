import { UserRole } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';
import { createWriteStream } from 'fs';
import { nanoid } from 'nanoid';
import { extendType, nullable } from 'nexus';
import { join } from 'path';

import { Error } from '../../../shared/constants';
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
        image: 'Upload',
        type: 'DeviceType'
      },
      authorize: guard(
        authorized(),
        validated(CreateDevice)
      ),
      resolve: async (parent, { model, brand, image, type }, { db, user }) => {
        const { createReadStream, extension, mime } = await image;

        if (!mime.startsWith('image/')) {
          throw new ApolloError('invalid file type', Error.InvalidFileType);
        }

        const fileName = `${nanoid()}.${extension}`;

        await new Promise((resolve, reject) => createReadStream()
          .pipe(createWriteStream(join(process.cwd(), 'public/uploads', fileName)))
          .on('close', resolve)
          .on('error', reject));

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
