import { UserRole } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { extendType, idArg, stringArg } from 'nexus';
import { Infer } from 'superstruct';

import { DeleteUser } from '../../../shared/structs/DeleteUser';
import { Login } from '../../../shared/structs/Login';
import { secret } from '../../constants';
import { authorized } from '../../guards/authorized';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';
import { inputError } from '../../utils/inputError';

export const UserMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createUser', {
      type: 'User',
      args: {
        email: stringArg(),
        password: stringArg()
      },
      authorize: guard(
        authorized(UserRole.ADMIN),
        validated(Login)
      ),
      resolve: async (parent, { email, password }, { db }) => {
        const hashed = await hash(password, 10);

        try {
          return await db.user.create({
            data: {
              email,
              password: hashed
            }
          });
        } catch {
          throw inputError<Infer<typeof Login>>([{
            path: 'email',
            type: 'emailInUse'
          }]);
        }
      }
    });

    t.field('deleteUser', {
      type: 'User',
      args: {
        id: idArg()
      },
      authorize: guard(
        authorized(UserRole.ADMIN),
        validated(DeleteUser)
      ),
      resolve: async (parent, { id }, { db }) => {
        try {
          const user = await db.user.findUnique({
            where: { id }
          });

          if (!user) {
            throw new ApolloError('');
          }

          await db.$transaction([
            db.contentBlock.deleteMany({
              where: { interaction: { overlay: { device: { user }}}}
            }),
            db.interaction.deleteMany({
              where: { overlay: { device: { user }}}
            }),
            db.overlay.deleteMany({
              where: { device: { user }}
            }),
            db.device.deleteMany({
              where: { user }
            }),
            db.user.delete({
              where: { id }
            })
          ]);

          return user;
        } catch {
          throw inputError<Infer<typeof DeleteUser>>([{
            path: 'id',
            type: 'userNotFound'
          }]);
        }
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
