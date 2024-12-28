import { google } from 'googleapis';
import { GOOGLE_SHEETS_CONFIG } from '../../config/google-sheets';
import { Logger } from './logger';

export function createGoogleAuth() {
  try {
    Logger.info('Creating Google Auth client...');
    Logger.debug('Using credentials:', {
      client_email: GOOGLE_SHEETS_CONFIG.credentials.client_email,
      private_key_length: GOOGLE_SHEETS_CONFIG.credentials.private_key?.length || 0,
    });

    const auth = new google.auth.GoogleAuth({
      credentials: {
        ...GOOGLE_SHEETS_CONFIG.credentials,
        private_key: GOOGLE_SHEETS_CONFIG.credentials.private_key?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    Logger.info('Google Auth client created successfully');
    return auth;
  } catch (error) {
    Logger.error('Failed to create Google Auth client:', error);
    throw error;
  }
}