import { UserRole } from '@prisma/client';
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
        authorized(UserRole.ADMIN)
      ),
      resolve: async () => {
        if (busy) {
          return false;
        }

        const file = join(process.cwd(), 'work', 'moneo.tflite');
        const sub = execa('make_image_classifier', [
          '--image_dir',
          join(process.cwd(), 'work'),
          '--tflite_output_file',
          file,
          '--labels_output_file',
          join(process.cwd(), 'work', 'moneo.txt')
        ]);

        busy = true;

        sub.stdout?.pipe(process.stdout);
        sub.then(() => updateModel(process.env.ML_ID ?? '', file)).finally(() => busy = false);

        return true;
      }
    });
  }
});
