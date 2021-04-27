import { UserRole } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';
import { compare, hash } from 'bcryptjs';
import { addDays, isAfter } from 'date-fns';
import { sign } from 'jsonwebtoken';
import { extendType, idArg, stringArg } from 'nexus';
import { Infer } from 'superstruct';

import { Error } from '../../../shared/constants';
import { CreateUser } from '../../../shared/structs/CreateUser';
import { InviteUser } from '../../../shared/structs/InviteUser';
import { Login } from '../../../shared/structs/Login';
import { secret } from '../../constants';
import { authorized } from '../../guards/authorized';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';
import { inputError } from '../../utils/inputError';

export const UserMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.boolean('inviteUser', {
      args: {
        email: stringArg()
      },
      authorize: guard(
        authorized(UserRole.ADMIN),
        validated(InviteUser)
      ),
      resolve: async (parent, { email }, { db }) => {
        try {
          const count = await db.user.count({
            where: { email }
          });

          if (count) {
            throw new ApolloError('');
          }

          const invite = await db.invite.create({
            data: { email }
          });

          console.log('Invite generated for:', invite.id);

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
      args: {
        inviteId: idArg(),
        password: stringArg()
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
            password: hashed
          }
        });
      }
    });

    t.field('login', {
      type: 'Authentication',
      args: {
        email: stringArg(),
        password: stringArg()
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
            role: user.role
          }, secret),
          user
        };
      }
    });
  }
});
