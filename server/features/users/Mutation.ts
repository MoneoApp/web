import { UserType } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';
import { compare, hash } from 'bcryptjs';
import { addDays, isAfter } from 'date-fns';
import { sign } from 'jsonwebtoken';
import { arg, extendType, idArg, nullable, stringArg } from 'nexus';
import { Infer } from 'superstruct';

import { Error, userElevation } from '../../../shared/constants';
import { CreateUser } from '../../../shared/structs/CreateUser';
import { InviteUser } from '../../../shared/structs/InviteUser';
import { Login } from '../../../shared/structs/Login';
import { UpdateUser } from '../../../shared/structs/UpdateUser';
import { secret } from '../../constants';
import { authorized } from '../../guards/authorized';
import { current } from '../../guards/current';
import { customer } from '../../guards/customer';
import { or } from '../../guards/or';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';
import { inputError } from '../../utils/inputError';
import { mail } from '../../utils/mail';

export const UserMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.boolean('inviteUser', {
      description: 'Create an invite for the specified customer. Sends an email to the specified email address. Only accessible by roles: ADMIN, CONTACT.',
      args: {
        customerId: idArg({
          description: 'The ID of the customer. Must be a valid ID.'
        }),
        email: stringArg({
          description: 'The email address of the user that should receive the invite. Must be a valid email.'
        })
      },
      authorize: guard(
        authorized(UserType.ADMIN, UserType.CONTACT),
        validated(InviteUser),
        customer(({ customerId }) => ({
          id: customerId
        }))
      ),
      resolve: async (parent, { customerId, email }, { db }) => {
        try {
          const count = await db.user.count({
            where: { email }
          });

          if (count) {
            throw new ApolloError('');
          }

          const invite = await db.invite.create({
            data: {
              customer: {
                connect: { id: customerId }
              },
              email
            }
          });

          await mail({
            to: email,
            subject: 'Uitnodiging Moneo',
            html: `U bent uitgenodigd voor Moneo. Klik <a href="${process.env.PUBLIC_URL}/?invite=${invite.id}">hier</a> om te registreren.`
          });

          return true;
        } catch {
          throw inputError<Infer<typeof InviteUser>>([{
            path: 'email',
            type: 'emailInUse'
          }]);
        }
      }
    });

    t.field('createUser', {
      type: 'User',
      description: 'Create a user with the specified invite. Attaches the user to the customer associated with the invite.',
      args: {
        inviteId: idArg({
          description: 'The ID of the invite. Must be a valid ID.'
        }),
        password: stringArg({
          description: 'The password of the new user. Must be at least 8 characters long, contain 1 capital letter and 1 number.'
        })
      },
      authorize: guard(
        validated(CreateUser)
      ),
      resolve: async (parent, { inviteId, password }, { db }) => {
        const invite = await db.invite.findUnique({
          where: { id: inviteId }
        });

        if (!invite) {
          throw new ApolloError('invalid invite', Error.InvalidInvite);
        }

        await db.invite.delete({
          where: { id: inviteId }
        });

        if (isAfter(Date.now(), addDays(invite.createdAt, 1))) {
          throw new ApolloError('invalid invite', Error.InvalidInvite);
        }

        const hashed = await hash(password, 10);

        return await db.user.create({
          data: {
            email: invite.email,
            password: hashed,
            type: invite.type,
            customer: {
              connect: { id: invite.customerId }
            }
          }
        });
      }
    });

    t.field('updateUser', {
      type: nullable('User'),
      description: 'Update the specified user. Only accessible by roles: ADMIN, CONTACT. If CONTACT, must be part of the same customer network.',
      args: {
        id: idArg({
          description: 'The ID of the user. Must be a valid ID.'
        }),
        email: stringArg({
          description: 'The email of the user. Must be a valid email.'
        }),
        type: arg({
          type: 'UserType',
          description: 'The new role of the user.'
        })
      },
      authorize: guard(
        authorized(UserType.ADMIN, UserType.CONTACT),
        validated(UpdateUser),
        customer(({ id }) => ({
          users: {
            some: { id }
          }
        }))
      ),
      resolve: (parent, { id, email, type }, { db, user }) => {
        if (userElevation[type] > userElevation[user!.type]) {
          throw new ApolloError('unauthorized', Error.Unauthorized);
        }

        return db.user.update({
          where: { id },
          data: {
            email,
            type
          }
        });
      }
    });

    t.field('deleteUser', {
      type: nullable('User'),
      description: 'Delete the specified user. Only accessible by roles: ADMIN, CONTACT, CURRENT. If CONTACT, must be part of the same customer network.',
      args: {
        id: idArg({
          description: 'The ID of the user. Must be a valid ID.'
        })
      },
      authorize: guard(
        or(current(), authorized(UserType.ADMIN, UserType.CONTACT)),
        customer(({ id }) => ({
          users: {
            some: { id }
          }
        }))
      ),
      resolve: async (parent, { id }, { db }) => db.user.delete({
        where: { id }
      })
    });

    t.field('login', {
      type: 'Authentication',
      description: 'Login as the specified user.',
      args: {
        email: stringArg({
          description: 'The email of the user. Must be a valid email.'
        }),
        password: stringArg({
          description: 'The password of the user. Must be at least 8 characters long, contain 1 capital letter and 1 number.'
        })
      },
      authorize: guard(
        validated(Login)
      ),
      resolve: async (parent, { email, password }, { db }) => {
        const user = await db.user.findUnique({
          where: { email }
        });

        if (!user || !await compare(password, user.password)) {
          throw inputError<Infer<typeof Login>>([{
            path: 'password',
            type: 'invalidCredentials'
          }]);
        }

        return {
          token: sign({
            id: user.id,
            type: user.type
          }, secret),
          user
        };
      }
    });
  }
});
