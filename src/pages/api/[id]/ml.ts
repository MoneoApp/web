import { createReadStream } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { resolve } from 'path';

import { findDevice } from '../../../utils/findDevice';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const device = await findDevice(res, (db) => db.device.findUnique({
    where: { id: id as string },
    select: { id: true }
  }));

  if (!device) {
    return;
  }

  const name = `ml-${device.id}.zip`;
  const path = resolve('.', 'public', 'uploads', name);

  res.setHeader('Content-Disposition', `attachment; filename=${name}`);
  res.setHeader('Content-Type', 'application/zip');

  const stream = createReadStream(path);

  stream.pipe(res);
}
