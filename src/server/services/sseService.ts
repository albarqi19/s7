import { Response } from 'express';
import type { ContentItem } from '../../types';

export class SSEService {
  private static instance: SSEService;
  private clients: Set<Response>;
  private currentContent: ContentItem | null;

  private constructor() {
    this.clients = new Set();
    this.currentContent = null;
  }

  static getInstance(): SSEService {
    if (!this.instance) {
      this.instance = new SSEService();
    }
    return this.instance;
  }

  addClient(res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    this.clients.add(res);

    if (this.currentContent) {
      res.write(`data: ${JSON.stringify(this.currentContent)}\n\n`);
    }
  }

  removeClient(res: Response): void {
    this.clients.delete(res);
  }

  broadcast(content: ContentItem): void {
    this.currentContent = content;
    this.clients.forEach(client => {
      client.write(`data: ${JSON.stringify(content)}\n\n`);
    });
  }
}