import { InteractionType, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { resolve } from 'path';
import Sharp from 'sharp';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const db = new PrismaClient({
    log: ['query']
  });

  const device = await db.device.findUnique({
    where: { id: id as string },
    include: {
      interactions: {
        where: {
          type: InteractionType.ANCHOR
        }
      }
    }
  });

  if (!device) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res
      .status(404)
      .send('¯\\_(404)_/¯');
  }

  const imgPath = resolve('.', 'public', 'uploads', device.image);

  let { x, y, width, height } = device.interactions[0];

  const sharpImg = await Sharp(imgPath);
  // const metadata = await sharpImg.metadata();
  // console.log(x, y, width, height);
  // x = Math.max(0, x);
  // y = Math.max(0, y);
  // width = Math.min(width, metadata.width ?? 0 - x);
  // height = Math.min(height, metadata.height ?? 0 - y);
  // console.log(x, y, width, height)

  const resizedImg = sharpImg
    .extract({
      left: Math.round(x),
      top: Math.round(y),
      width: Math.round(width),
      height: Math.round(height)
    })
    .resize(300)
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.send(resizedImg);
}
