import { ApolloError } from 'apollo-server-micro';
import { createWriteStream } from 'fs';
import { nanoid } from 'nanoid';
import { join } from 'path';

import { Error } from '../../shared/constants';

export async function storeFile(file: any, mimeStart: string, name = nanoid(), path = join(process.cwd(), 'public', 'uploads')) {
  const { createReadStream, extension, mime } = await file;

  if (!mime.startsWith(mimeStart)) {
    throw new ApolloError('invalid file type', Error.InvalidFileType);
  }

  const fileName = `${name}.${extension}`;

  await new Promise((resolve, reject) => createReadStream()
    .pipe(createWriteStream(join(path, fileName)))
    .on('close', resolve)
    .on('error', reject));

  return fileName;
}
