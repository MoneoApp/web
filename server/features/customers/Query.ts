import { UserType } from '@prisma/client';
import { extendType, idArg, list, nullable } from 'nexus';

import { authorized } from '../../guards/authorized';
import { customer } from '../../guards/customer';
import { guard } from '../../utils/guard';

export const CustomerQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('customers', {
      type: list('Customer'),
      description: 'Get all registered customers. Only accessible by roles: ADMIN.',
      authorize: guard(
        authorized(UserType.ADMIN)
      ),
      resolve: (parent, args, { db }) => db.customer.findMany()
    });

    t.field('customer', {
      type: nullable('Customer'),
      description: 'Get the details of the specified customer. Only accessible by roles: ADMIN, CONTACT, USER. If CONTACT or USER, must be part of the same customer network.',
      args: {
        id: idArg({
          description: 'The ID of the customer. Must be a valid ID.'
        })
      },
      authorize: guard(
        authorized(),
        customer(({ id }) => ({
          id
        }))
      ),
      resolve: (parent, { id }, { db }) => db.customer.findUnique({
        where: { id }
      })
    });
  }
});
