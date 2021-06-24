/* tslint:disable:no-console */
import { UserType } from '@prisma/client';
import execa from 'execa';
import { nanoid } from 'nanoid';
import { arg, extendType } from 'nexus';
import { join } from 'path';
import Sharp from 'sharp';

import { authorized } from '../../guards/authorized';
import { guard } from '../../utils/guard';
import { storeFile } from '../../utils/storeFile';
import { updateModel } from '../../utils/updateModel';

let busy = false;

export const ModelMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.boolean('retrain', {
      description: 'Start the retraining process of the model. This can take up to an hour. Will return false if already busy, otherwise true. Only accessible by roles: ADMIN.',
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

        console.log('Retraining model...');

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

    t.int('score', {
      description: 'Get the score of the specified anchor image. A score of at least 75 is recommended. Only accessible by roles: ADMIN, CONTACT, USER.',
      args: {
        image: arg({
          type: 'Upload',
          description: 'The thumbnail image of the device. Must be a .PNG or .JPG.'
        }),
        interaction: arg({
          type: 'UpsertInteraction',
          description: 'The interaction of the anchor.'
        })
      },
      authorize: guard(
        authorized()
      ),
      resolve: async (parent, { image, interaction }) => {
        try {
          const temp = join(process.cwd(), 'temp');
          const imageName = await storeFile(image, 'image/', nanoid(), temp);
          const { x, y, width } = interaction;

          await Sharp(join(temp, imageName))
            .extract({
              left: Math.round(x),
              top: Math.round(y),
              width: Math.round(width),
              height: Math.round(width)
            })
            .resize(300)
            .toFile(join(temp, `resized-${imageName}`));

          const { stdout } = await execa(join(process.cwd(), 'scripts', 'arcoreimg'), [
            'eval-img',
            '--input_image_path',
            join(temp, `resized-${imageName}`)
          ]);

          return Number(stdout) || 0;
        } catch (e) {
          console.log(e);
          return 0;
        }
      }
    });
  }
});
