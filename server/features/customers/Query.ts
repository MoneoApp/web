import { UserType } from '@prisma/client';
import { extendType, list, nullable } from 'nexus';

import { authorized } from '../../guards/authorized';
import { customer } from '../../guards/customer';
import { guard } from '../../utils/guard';

export const CustomerQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('customers', {
      type: list('Customer'),
      authorize: guard(
        authorized(UserType.ADMIN)
      ),
      resolve: (parent, args, { db }) => db.customer.findMany()
    });

    t.field('customer', {
      type: nullable('Customer'),
      args: {
        id: 'ID'
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
