import { UserType } from '@prisma/client';
import { extendType, nullable } from 'nexus';

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
      type: 'Customer',
      args: {
        name: 'String',
        email: 'String'
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
      args: {
        id: 'ID',
        name: 'String'
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
      args: {
        id: 'ID'
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
