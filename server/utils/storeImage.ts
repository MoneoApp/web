import { ApolloError } from 'apollo-server-micro';
import { createWriteStream } from 'fs';
import { nanoid } from 'nanoid';
import { join } from 'path';

import { Error } from '../../shared/constants';

export async function storeImage(image: any) {
  const { createReadStream, extension, mime } = await image;

  if (!mime.startsWith('image/')) {
    throw new ApolloError('invalid file type', Error.InvalidFileType);
  }

  const fileName = `${nanoid()}.${extension}`;

  await new Promise((resolve, reject) => createReadStream()
    .pipe(createWriteStream(join(process.cwd(), 'public/uploads', fileName)))
    .on('close', resolve)
    .on('error', reject));

  return fileName;
}
