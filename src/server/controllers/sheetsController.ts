import { Request, Response } from 'express';
import { SheetsService } from '../services/sheetsService';
import { Logger } from '../services/logger';

export const sheetsController = {
  async getContents(_req: Request, res: Response): Promise<void> {
    try {
      Logger.info('Fetching contents from Google Sheets...');
      const service = SheetsService.getInstance();
      Logger.debug('SheetsService instance:', service);
      
      const contents = await service.getContents();
      Logger.info('Contents fetched successfully:', contents);
      
      res.json(contents);
    } catch (error: any) {
      Logger.error('Error in sheetsController.getContents:', error);
      res.status(500).json({ 
        error: 'Failed to fetch contents',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};