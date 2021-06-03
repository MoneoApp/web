import { fromStream } from 'file-type';
import { GraphQLError } from 'graphql';
import { scalarType } from 'nexus';

import { mimeOverrides } from '../constants';

export const Upload = scalarType({
  name: 'Upload',
  serialize: () => {
    throw new GraphQLError('Upload serialization unsupported.');
  },
  parseValue: async (value) => {
    const upload = await value;
    const stream = upload.createReadStream();
    const fileType = await fromStream(stream);
    const mime = mimeOverrides[upload.mimetype] ?? upload.mimetype;

    if (!fileType || fileType.mime !== mime) {
      throw new GraphQLError('Mime type does not match file content.');
    }

    return {
      createReadStream: upload.createReadStream,
      extension: fileType.ext,
      mime: fileType.mime
    };
  },
  parseLiteral: (node) => {
    throw new GraphQLError('Upload literal unsupported.', node);
  }
});
