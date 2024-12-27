import { google } from 'googleapis';
import { Logger } from './logger';

export const getAuthClient = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    Logger.info('Google Auth client created successfully');
    return auth;
  } catch (error: any) {
    Logger.error('Error creating Google Auth client:', error);
    throw new Error(`Failed to create auth client: ${error.message}`);
  }
};