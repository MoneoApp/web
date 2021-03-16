import { ApolloError } from 'apollo-server-micro';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { extendType, stringArg } from 'nexus';

import { Errors } from '../../../shared/constants';
import { Login } from '../../../shared/structs/Login';
import { secret } from '../../constants';
import { validate } from '../../guards/validate';

export const UserMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createUser', {
      type: 'Authentication',
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
          const user = await db.user.create({
            data: {
              email,
              password: hashed
            }
          });

          return {
            token: sign(user.id, secret),
            user
          };
        } catch {
          throw new ApolloError('email in use', Errors.EmailInUse);
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
          throw new ApolloError('authentication failed', Errors.AuthenticationFailed);
        }

        return {
          token: sign(user.id, secret),
          user
        };
      }
    });
  }
});
