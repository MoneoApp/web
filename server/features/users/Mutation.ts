import { UserRole } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { extendType, idArg, nullable, stringArg } from 'nexus';
import { Infer } from 'superstruct';

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
      type: nullable('User'),
      args: {
        id: idArg()
      },
      authorize: guard(
        authorized(UserRole.ADMIN)
      ),
      resolve: async (parent, { id }, { db }) => {
        const transaction = await db.$transaction([
          db.contentBlock.deleteMany({
            where: { interaction: { overlay: { device: { user: { id } }}}}
          }),
          db.interaction.deleteMany({
            where: { overlay: { device: { user: { id } }}}
          }),
          db.overlay.deleteMany({
            where: { device: { user: { id } }}
          }),
          db.device.deleteMany({
            where: { user: { id } }
          }),
          db.user.delete({
            where: { id }
          })
        ]);

        return transaction[4];
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
