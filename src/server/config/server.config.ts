import dotenv from 'dotenv';

dotenv.config();

export const SERVER_CONFIG = {
  port: 3001,
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  sheets: {
    range: 'الورقة1!A2:D',
    valueRenderOption: 'FORMATTED_VALUE'
  }
};