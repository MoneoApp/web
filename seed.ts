import { PrismaClient, UserType } from '@prisma/client';

export async function seed() {
  const db = new PrismaClient();

  await db.customer.create({
    data: {
      name: 'Moneo',
      users: {
        create: [{
          email: 'admin@moneo.ml',
          password: '$2a$10$c9WRXiAl2szjWwIggA8SP.Qogu4RqUJgFKUBfQMR..WT7IqpjTrzu',
          type: UserType.ADMIN
        }, {
          email: 'contect@moneo.ml',
          password: '$2a$10$c9WRXiAl2szjWwIggA8SP.Qogu4RqUJgFKUBfQMR..WT7IqpjTrzu',
          type: UserType.CONTACT
        }, {
          email: 'user@moneo.ml',
          password: '$2a$10$c9WRXiAl2szjWwIggA8SP.Qogu4RqUJgFKUBfQMR..WT7IqpjTrzu',
          type: UserType.USER
        }]
      }
    }
  });

  await db.$disconnect();
}
