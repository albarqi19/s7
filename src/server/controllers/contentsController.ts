import { Request, Response } from 'express';
import { SheetsService } from '../services/sheetsService';
import { Logger } from '../services/logger';

export async function getContents(req: Request, res: Response) {
  try {
    Logger.info('Fetching contents');
    const contents = await SheetsService.getInstance().getContents();
    Logger.info('Contents fetched successfully');
    res.json(contents);
  } catch (error) {
    Logger.error('Error fetching contents:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to fetch contents',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}