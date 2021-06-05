/* tslint:disable:no-console */
import { UserType } from '@prisma/client';
import execa from 'execa';
import { extendType } from 'nexus';
import { join } from 'path';

import { authorized } from '../../guards/authorized';
import { guard } from '../../utils/guard';
import { updateModel } from '../../utils/updateModel';

let busy = false;

export const ModelMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.boolean('retrain', {
      authorize: guard(
        authorized(UserType.ADMIN)
      ),
      resolve: async () => {
        if (busy) {
          return false;
        }

        busy = true;

        const modelFile = join(process.cwd(), 'work', 'moneo.tflite');
        const labelFile = join(process.cwd(), 'work', 'moneo.txt');
        const outputFile = join(process.cwd(), 'work', 'moneo_populated.tflite');

        console.log('Retraining model...')

        execa('make_image_classifier', [
          '--image_dir',
          join(process.cwd(), 'work'),
          '--tflite_output_file',
          modelFile,
          '--labels_output_file',
          labelFile
        ]).then(() => execa('python', [
          join(process.cwd(), 'scripts', 'populateMetadata.py'),
          '--model_file',
          modelFile,
          '--label_file',
          labelFile,
          '--output_file',
          outputFile
        ])).then(() => updateModel(process.env.ML_ID ?? '', outputFile))
          .then(() => console.log('Successfully retrained model'))
          .catch((e) => console.error('Something went wrong', e))
          .finally(() => busy = false);

        return true;
      }
    });
  }
});
