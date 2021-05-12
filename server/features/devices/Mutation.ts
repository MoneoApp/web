import { ApolloError } from 'apollo-server-micro';
import { createWriteStream } from 'fs';
import { nanoid } from 'nanoid';
import { extendType } from 'nexus';
import { join } from 'path';

import { Error } from '../../../shared/constants';
import { CreateDevice } from '../../../shared/structs/CreateDevice';
import { authorized } from '../../guards/authorized';
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
  }
});
