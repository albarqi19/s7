import { Request, Response } from 'express';
import { displayController } from '../../controllers/displayController';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    return displayController.setupSSE(req, res);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
