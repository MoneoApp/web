import { PrismaClient, UserType } from '@prisma/client';

export async function seed() {
  const db = new PrismaClient();

  await db.customer.create({
    data: {
      name: 'Moneo',
      users: {
        create: [{
          email: 'admin@moneo.ml',
          password: '$2a$10$23OzImzTNsqoI8w7s9nHzuj86G/m7MZ33Dy5fteXSoPp/T6mNKXju',
          type: UserType.ADMIN
        }, {
          email: 'contact@moneo.ml',
          password: '$2a$10$23OzImzTNsqoI8w7s9nHzuj86G/m7MZ33Dy5fteXSoPp/T6mNKXju',
          type: UserType.CONTACT
        }, {
          email: 'user@moneo.ml',
          password: '$2a$10$23OzImzTNsqoI8w7s9nHzuj86G/m7MZ33Dy5fteXSoPp/T6mNKXju',
          type: UserType.USER
        }]
      }
    }
  });

  await db.$disconnect();
}
