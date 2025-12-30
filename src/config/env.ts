import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 8008,
  NODE_ENV: process.env.NODE_ENV || 'development',
};