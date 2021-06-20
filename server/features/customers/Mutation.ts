import { UserType } from '@prisma/client';
import { extendType, idArg, nullable, stringArg } from 'nexus';

import { CreateCustomer } from '../../../shared/structs/CreateCustomer';
import { UpdateCustomer } from '../../../shared/structs/UpdateCustomer';
import { authorized } from '../../guards/authorized';
import { customer } from '../../guards/customer';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';
import { mail } from '../../utils/mail';

export const CustomerMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createCustomer', {
      description: 'Create a customer. Invites the specified email as CONTACT user. Only accessible by roles: ADMIN.',
      type: 'Customer',
      args: {
        name: stringArg({
          description: 'The name of the customer. Must be 3 to 70 characters long.'
        }),
        email: stringArg({
          description: 'The email address of the contact that should receive the invite. Must be a valid email.'
        })
      },
      authorize: guard(
        authorized(UserType.ADMIN),
        validated(CreateCustomer)
      ),
      resolve: async (parent, { name, email }, { db }) => {
        const data = await db.customer.create({
          data: { name }
        });

        const invite = await db.invite.create({
          data: {
            customer: {
              connect: { id: data.id }
            },
            email,
            type: UserType.CONTACT
          }
        });

        await mail({
          to: email,
          subject: 'Uitnodiging Moneo',
          html: `U bent uitgenodigd voor Moneo. Klik <a href="${process.env.PUBLIC_URL}/?invite=${invite.id}">hier</a> om te registreren.`
        });

        return data;
      }
    });

    t.field('updateCustomer', {
      type: nullable('Customer'),
      description: 'Update the specified customer. Only accessible by roles: ADMIN, CONTACT. If CONTACT, must be part of the same customer network.',
      args: {
        id: idArg({
          description: 'The ID of the customer. Must be a valid ID.'
        }),
        name: stringArg({
          description: 'The name of the customer. Must be 3 to 70 characters long.'
        })
      },
      authorize: guard(
        authorized(UserType.ADMIN, UserType.CONTACT),
        validated(UpdateCustomer),
        customer(({ id }) => ({
          id
        }))
      ),
      resolve: (parent, { id, name }, { db }) => db.customer.update({
        where: { id },
        data: { name }
      })
    });

    t.field('deleteCustomer', {
      type: nullable('Customer'),
      description: 'Delete the specified customer. Only accessible by roles: ADMIN, CONTACT, CURRENT. If CONTACT, must be part of the same customer network.',
      args: {
        id: idArg({
          description: 'The ID of the customer. Must be a valid ID.'
        })
      },
      authorize: guard(
        authorized(UserType.ADMIN, UserType.CONTACT),
        customer(({ id }) => ({
          id
        }))
      ),
      resolve: async (parent, { id }, { db }) => {
        const transaction = await db.$transaction([
          db.manualStep.deleteMany({
            where: { manual: { device: { customer: { id } } } }
          }),
          db.manual.deleteMany({
            where: { device: { customer: { id } } }
          }),
          db.interaction.deleteMany({
            where: { device: { customer: { id } } }
          }),
          db.device.deleteMany({
            where: { customer: { id } }
          }),
          db.user.deleteMany({
            where: { customer: { id } }
          }),
          db.customer.delete({
            where: { id }
          })
        ]);

        return transaction[5];
      }
    });
  }
});
