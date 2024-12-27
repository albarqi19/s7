import { Request, Response } from 'express';
import { displayController } from '../controllers/displayController';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: Request, res: Response) {
  switch (req.method) {
    case 'GET':
      return displayController.getCurrentDisplay(req, res);
    case 'POST':
      return displayController.updateDisplay(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
