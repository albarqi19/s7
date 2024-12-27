import { Request, Response } from 'express';
import { SheetsService } from '../services/sheetsService';
import { SSEService } from '../services/sseService';

export const displayController = {
  async setupSSE(req: Request, res: Response): Promise<void> {
    try {
      SSEService.getInstance().addClient(res);
      req.on('close', () => SSEService.getInstance().removeClient(res));
      
      // Keep the connection alive
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write('\n');
    } catch (error: any) {
      console.error('SSE setup error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async updateDisplay(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;
      const contents = await SheetsService.getInstance().getContents();
      const content = contents.find(item => item.id === id);
      
      if (!content) {
        res.status(404).json({ error: 'Content not found' });
        return;
      }

      SSEService.getInstance().broadcast(content);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Display update error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getCurrentDisplay(_req: Request, res: Response): Promise<void> {
    try {
      const service = SheetsService.getInstance();
      const contents = await service.getContents();
      res.json(contents[0] || null);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch current display',
        details: error.message
      });
    }
  }
};