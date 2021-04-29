import { UserRole } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';
import { compare, hash } from 'bcryptjs';
import { addDays, isAfter } from 'date-fns';
import { sign } from 'jsonwebtoken';
import { extendType, nullable } from 'nexus';
import { createTransport } from 'nodemailer';
import { Infer } from 'superstruct';

import { Error } from '../../../shared/constants';
import { CreateUser } from '../../../shared/structs/CreateUser';
import { InviteUser } from '../../../shared/structs/InviteUser';
import { Login } from '../../../shared/structs/Login';
import { UpdateUser } from '../../../shared/structs/UpdateUser';
import { secret } from '../../constants';
import { authorized } from '../../guards/authorized';
import { current } from '../../guards/current';
import { or } from '../../guards/or';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';
import { inputError } from '../../utils/inputError';

export const UserMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.boolean('inviteUser', {
      args: {
        email: 'String'
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

          const transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            secure: false,
            auth: {
              user: process.env.SMTP_USERNAME,
              pass: process.env.SMTP_PASSWORD
            }
          });

          await transporter.sendMail({
            from: `"Moneo App" <${process.env.SMTP_USERNAME}>`,
            to: email,
            subject: 'Uitnodiging Moneo',
            html: `U bent uitgenodigd voor Moneo. Klik <a href="${process.env.PUBLIC_URL}/?invite=${invite.id}">hier</a> om te registreren`
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
      args: {
        inviteId: 'ID',
        password: 'String'
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

    t.field('updateUser', {
      type: nullable('User'),
      args: {
        id: 'ID',
        email: 'String',
        role: 'UserRole'
      },
      authorize: guard(
        or(current(), authorized(UserRole.ADMIN)),
        validated(UpdateUser)
      ),
      resolve: (parent, { id, email, role }, { db }) => db.user.update({
        where: { id },
        data: {
          email,
          role
        }
      })
    });

    t.field('deleteUser', {
      type: nullable('User'),
      args: {
        id: 'ID'
      },
      authorize: guard(
        authorized(UserRole.ADMIN)
      ),
      resolve: async (parent, { id }, { db }) => {
        const transaction = await db.$transaction([
          db.contentBlock.deleteMany({
            where: { interaction: { overlay: { device: { user: { id } } } } }
          }),
          db.interaction.deleteMany({
            where: { overlay: { device: { user: { id } } } }
          }),
          db.overlay.deleteMany({
            where: { device: { user: { id } } }
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
        email: 'String',
        password: 'String'
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
