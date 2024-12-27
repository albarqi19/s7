import { Request, Response } from 'express';
import { sheetsController } from '../controllers/sheetsController';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    return sheetsController.getContents(req, res);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
