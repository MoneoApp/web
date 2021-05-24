import { extendType, list, nullable } from 'nexus';

import { CreateManual } from '../../../shared/structs/CreateManual';
import { UpdateManual } from '../../../shared/structs/UpdateManual';
import { authorized } from '../../guards/authorized';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';

export const ManualMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createManual', {
      type: 'Manual',
      args: {
        deviceId: 'ID',
        title: 'String',
        steps: list('UpsertManualStep')
      },
      authorize: guard(
        authorized(),
        validated(CreateManual)
      ),
      resolve: async (parent, { deviceId, title, steps }, { db }) => {
        const manual = await db.manual.create({
          data: {
            device: {
              connect: { id: deviceId }
            },
            title
          }
        });

        await db.$transaction(steps.map((step) => db.manualStep.create({
          data: {
            manual: {
              connect: { id: manual.id }
            },
            text: step.text,
            order: step.order,
            interactions: {
              connect: step.interactionIds.map((interactionId) => ({
                id: interactionId
              }))
            }
          }
        })));

        return manual;
      }
    });

    t.field('updateManual', {
      type: nullable('Manual'),
      args: {
        id: 'ID',
        title: 'String',
        steps: list('UpsertManualStep')
      },
      authorize: guard(
        authorized(),
        validated(UpdateManual)
      ),
      resolve: async (parent, { id, title, steps }, { db }) => {
        const manual = await db.manual.update({
          where: { id },
          data: { title }
        });

        if (!manual) {
          return null;
        }

        await db.$transaction([
          db.manualStep.deleteMany({
            where: {
              manual: { id }
            }
          }),
          ...steps.map((step) => db.manualStep.create({
            data: {
              manual: {
                connect: { id: manual.id }
              },
              text: step.text,
              order: step.order,
              interactions: {
                connect: step.interactionIds.map((interactionId) => ({
                  id: interactionId
                }))
              }
            }
          }))
        ]);

        return manual;
      }
    });

    t.field('deleteManual', {
      type: nullable('Manual'),
      args: {
        id: 'ID'
      },
      resolve: async (parent, { id }, { db }) => {
        const transaction = await db.$transaction([
          db.manualStep.deleteMany({
            where: { manual: { id } }
          }),
          db.manual.delete({
            where: { id }
          })
        ]);

        return transaction[1];
      }
    });
  }
});
