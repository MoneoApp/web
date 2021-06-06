import { InteractionType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { resolve } from 'path';
import Sharp from 'sharp';

import { findDevice } from '../../../utils/findDevice';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const device = await findDevice(res, (db) => db.device.findUnique({
    where: { id: id as string },
    select: {
      image: true,
      interactions: {
        where: { type: InteractionType.ANCHOR }
      }
    }
  }));

  if (!device || !device.interactions.length) {
    return;
  }

  const path = resolve('.', 'public', 'uploads', device.image);
  const sharp = await Sharp(path);
  const metadata = await sharp.metadata();

  let { x, y, width } = device.interactions[0];
  const totalWidth = metadata.width ?? 1;
  const totalHeight = metadata.height ?? 1;

  x = Math.max(0, x);
  y = Math.max(0, y);
  width = Math.min(width, totalWidth - x, totalHeight - y);

  if (width < 0) {
    x = 0;
    y = 0;
    width = Math.min(totalWidth, totalHeight);
  }

  const image = await sharp
    .extract({
      left: Math.round(x),
      top: Math.round(y),
      width: Math.round(width),
      height: Math.round(width)
    })
    .resize(300)
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.send(image);
}
