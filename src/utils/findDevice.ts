import { PrismaClient } from '@prisma/client';
import { NextApiResponse } from 'next';

export async function findDevice<T>(res: NextApiResponse, find: (db: PrismaClient) => Promise<T>) {
  const db = new PrismaClient({
    log: ['query']
  });

  const device = await find(db);

  await db.$disconnect();

  if (!device) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    return res
      .status(404)
      .send('¯\\_(404)_/¯');
  }

  return device;
}
