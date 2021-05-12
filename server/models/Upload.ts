import { fromStream } from 'file-type';
import { GraphQLError } from 'graphql';
import { scalarType } from 'nexus';

export const Upload = scalarType({
  name: 'Upload',
  serialize: () => {
    throw new GraphQLError('Upload serialization unsupported.');
  },
  parseValue: async (value) => {
    const upload = await value;
    const stream = upload.createReadStream();
    const fileType = await fromStream(stream);

    if (!fileType || fileType.mime !== upload.mimetype) {
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
