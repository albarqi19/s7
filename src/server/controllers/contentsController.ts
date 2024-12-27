import { Request, Response } from 'express';
import { SheetsService } from '../services/sheetsService';

export const contentsController = {
  async getContents(_req: Request, res: Response): Promise<void> {
    try {
      const service = SheetsService.getInstance();
      const contents = await service.getContents();
      res.json(contents);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch contents',
        details: error.message
      });
    }
  }
};