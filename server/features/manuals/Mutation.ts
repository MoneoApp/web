import { UserType } from '@prisma/client';
import { arg, extendType, idArg, list, nullable, stringArg } from 'nexus';

import { CreateManual } from '../../../shared/structs/CreateManual';
import { UpdateManual } from '../../../shared/structs/UpdateManual';
import { authorized } from '../../guards/authorized';
import { customer } from '../../guards/customer';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';

export const ManualMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createManual', {
      type: 'Manual',
      description: 'Create a manual with the specified steps. Only accessible by roles: ADMIN, CONTACT, USER. If CONTACT or USER, must be part of the same customer network.',
      args: {
        deviceId: idArg({
          description: 'The ID of the device this manual associates with. Must be a valid ID.'
        }),
        title: stringArg({
          description: 'The title of the manual. Must be 3 to 70 characters long.'
        }),
        steps: list(arg({
          type: 'UpsertManualStep',
          description: 'A list of manual steps. Must have at least 1 step.'
        }))
      },
      authorize: guard(
        authorized(),
        validated(CreateManual),
        customer(({ deviceId }) => ({
          devices: {
            some: { id: deviceId }
          }
        }))
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
              createMany: {
                data: step.interactions.map(({ id, color }) => ({
                  interactionId: id,
                  color
                }))
              }
            }
          }
        })));

        return manual;
      }
    });

    t.field('updateManual', {
      type: nullable('Manual'),
      description: 'Update the specified manual. Only accessible by roles: ADMIN, CONTACT, USER. If CONTACT or USER, must be part of the same customer network.',
      args: {
        id: idArg({
          description: 'The ID of the manual. Must be a valid ID.'
        }),
        title: stringArg({
          description: 'The title of the manual. Must be 3 to 70 characters long.'
        }),
        steps: list(arg({
          type: 'UpsertManualStep',
          description: 'A list of manual steps. Must have at least 1 step.'
        }))
      },
      authorize: guard(
        authorized(),
        validated(UpdateManual),
        customer(({ id }) => ({
          devices: {
            some: {
              manuals: {
                some: { id }
              }
            }
          }
        }))
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
          db.manualStepInteraction.deleteMany({
            where: { step: { manual: { id } } }
          }),
          db.manualStep.deleteMany({
            where: { manual: { id } }
          }),
          ...steps.map((step) => db.manualStep.create({
            data: {
              manual: {
                connect: { id: manual.id }
              },
              text: step.text,
              order: step.order,
              interactions: {
                createMany: {
                  data: step.interactions.map(({ id: interactionId, color }) => ({
                    interactionId,
                    color
                  }))
                }
              }
            }
          }))
        ]);

        return manual;
      }
    });

    t.field('deleteManual', {
      type: nullable('Manual'),
      description: 'Delete the specified manual. Only accessible by roles: ADMIN, CONTACT. If CONTACT, must be part of the same customer network.',
      args: {
        id: idArg({
          description: 'The ID of the manual. Must be a valid ID.'
        })
      },
      authorize: guard(
        authorized(UserType.ADMIN, UserType.CONTACT),
        customer(({ id }) => ({
          devices: {
            some: {
              manuals: {
                some: { id }
              }
            }
          }
        }))
      ),
      resolve: async (parent, { id }, { db }) => {
        const transaction = await db.$transaction([
          db.manualStepInteraction.deleteMany({
            where: { step: { manual: { id } } }
          }),
          db.manualStep.deleteMany({
            where: { manual: { id } }
          }),
          db.manual.delete({
            where: { id }
          })
        ]);

        return transaction[2];
      }
    });
  }
});
