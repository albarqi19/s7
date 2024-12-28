import { Request, Response } from 'express';
import { SheetsService } from '../services/sheetsService';
import { SSEService } from '../services/sseService';

export async function setupSSE(req: Request, res: Response) {
  try {
    SSEService.getInstance().addClient(res);
    req.on('close', () => SSEService.getInstance().removeClient(res));
  } catch (error) {
    console.error('SSE setup error:', error);
    res.status(500).end();
  }
}

export async function updateDisplay(req: Request, res: Response) {
  try {
    const { id } = req.body;
    const contents = await SheetsService.getInstance().getContents();
    const content = contents.find(item => item.id === id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    SSEService.getInstance().broadcast(content);
    res.json({ success: true });
  } catch (error) {
    console.error('Display update error:', error);
    res.status(500).json({ error: 'Failed to update display' });
  }
}