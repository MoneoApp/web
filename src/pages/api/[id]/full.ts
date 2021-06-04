import { readFile } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import { resolve } from 'path';

import { findDevice } from '../../../utils/findDevice';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const device = await findDevice(res, (db) => db.device.findUnique({
    where: { id: id as string },
    select: { image: true }
  }));

  if (!device) {
    return;
  }

  const path = resolve('.', 'public', 'uploads', device.image);
  const file = await readFile(path);

  res.setHeader('Content-Type', 'image/png');
  res.send(file);
}
