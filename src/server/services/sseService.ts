import { Response } from 'express';
import type { ContentItem } from '../../types';
import { Logger } from './logger';

export class SSEService {
  private static instance: SSEService;
  private clients: Set<Response>;

  private constructor() {
    this.clients = new Set();
  }

  public static getInstance(): SSEService {
    if (!SSEService.instance) {
      SSEService.instance = new SSEService();
    }
    return SSEService.instance;
  }

  public addClient(client: Response): void {
    Logger.info('New SSE client connected');
    client.setHeader('Content-Type', 'text/event-stream');
    client.setHeader('Cache-Control', 'no-cache');
    client.setHeader('Connection', 'keep-alive');
    
    this.clients.add(client);
  }

  public removeClient(client: Response): void {
    Logger.info('SSE client disconnected');
    this.clients.delete(client);
  }

  public broadcast(content: ContentItem): void {
    Logger.info(`Broadcasting content update to ${this.clients.size} clients`);
    const data = JSON.stringify(content);
    
    this.clients.forEach(client => {
      try {
        client.write(`data: ${data}\n\n`);
      } catch (error) {
        Logger.error('Error sending SSE message:', error);
        this.removeClient(client);
      }
    });
  }
}