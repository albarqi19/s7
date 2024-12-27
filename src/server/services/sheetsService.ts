import { google } from 'googleapis';
import { getAuthClient } from './googleAuth';
import { GOOGLE_SHEETS_CONFIG } from '../../config/google-sheets';
import type { ContentItem } from '../../types';
import { Logger } from './logger';

export class SheetsService {
  private static instance: SheetsService;
  private sheets: any;

  private constructor() {
    this.initializeSheets();
  }

  public static getInstance(): SheetsService {
    if (!SheetsService.instance) {
      SheetsService.instance = new SheetsService();
    }
    return SheetsService.instance;
  }

  private async initializeSheets() {
    try {
      const auth = await getAuthClient();
      this.sheets = google.sheets({ version: 'v4', auth });
      Logger.info('Google Sheets API initialized successfully');
    } catch (error: any) {
      Logger.error('Error initializing Google Sheets API:', error);
      throw new Error(`Failed to initialize Google Sheets: ${error.message}`);
    }
  }

  async getContents(): Promise<ContentItem[]> {
    try {
      if (!this.sheets) {
        await this.initializeSheets();
      }

      Logger.info('Fetching sheet data...');
      Logger.debug('Using config:', {
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        range: GOOGLE_SHEETS_CONFIG.sheets.range,
        valueRenderOption: GOOGLE_SHEETS_CONFIG.sheets.valueRenderOption
      });

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        range: GOOGLE_SHEETS_CONFIG.sheets.range,
        valueRenderOption: GOOGLE_SHEETS_CONFIG.sheets.valueRenderOption,
      });

      Logger.debug('Sheet response received', {
        status: response.status,
        data: response.data,
        values: response.data.values?.length || 0
      });

      if (!response.data.values) {
        Logger.info('No data found in sheet');
        return [];
      }

      const contents = this.transformSheetData(response.data.values);
      Logger.debug('Transformed contents', contents);
      return contents;
    } catch (error: any) {
      Logger.error('Error fetching data from Google Sheets:', error);
      throw new Error(`Failed to fetch contents: ${error.message}`);
    }
  }

  private transformSheetData(rows: any[]): ContentItem[] {
    try {
      Logger.debug('Transforming sheet data', { rowCount: rows.length });
      return rows.map((row, index) => {
        const item = {
          id: index + 1,
          name: row[0]?.toString() || `محتوى ${index + 1}`,
          content: row[1]?.toString() || '',
          type: this.determineContentType(row[1]?.toString()),
          duration: row[2] ? parseInt(row[2].toString()) : 5000
        };
        Logger.debug(`Transformed row ${index + 1}`, item);
        return item;
      });
    } catch (error: any) {
      Logger.error('Error transforming sheet data', error);
      throw new Error(`Failed to transform sheet data: ${error.message}`);
    }
  }

  private determineContentType(content?: string): 'image' | 'url' {
    if (!content) return 'url';
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const lowercaseContent = content.toLowerCase();
    const type = imageExtensions.some(ext => lowercaseContent.endsWith(ext)) ? 'image' : 'url';
    Logger.debug('Determined content type', { content, type });
    return type;
  }
}