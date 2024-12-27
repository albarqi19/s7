import dotenv from 'dotenv';

dotenv.config();

// تنظيف المفتاح الخاص
const cleanPrivateKey = (key: string | undefined) => {
  if (!key) return '';
  return key.replace(/\\n/g, '\n').replace(/"/g, '');
};

export const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME,
  sheets: {
    range: 'الورقة1!A2:D',
    valueRenderOption: 'FORMATTED_VALUE'
  },
  credentials: {
    type: 'service_account',
    project_id: 'sonic-momentum-292409',
    private_key_id: '5b94e204947a343ce9be5206f75e7a5bfe74d0d5',
    private_key: cleanPrivateKey(process.env.GOOGLE_SHEETS_PRIVATE_KEY),
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    client_id: '116443909497048101654',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_SHEETS_CLIENT_EMAIL}`
  }
};