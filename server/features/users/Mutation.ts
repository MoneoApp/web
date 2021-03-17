import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { extendType, stringArg } from 'nexus';
import { Infer } from 'superstruct';

import { Login } from '../../../shared/structs/Login';
import { secret } from '../../constants';
import { validate } from '../../guards/validate';
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
      authorize: (parent, args, { guard }) => guard(
        validate(args, Login)
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

    t.field('login', {
      type: 'Authentication',
      args: {
        email: stringArg(),
        password: stringArg()
      },
      authorize: (parent, args, { guard }) => guard(
        validate(args, Login)
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
          token: sign(user.id, secret),
          user
        };
      }
    });
  }
});
